"""
Functional tests for MediaHub backend API.
Validates all REST endpoints after TypeScript migration (Milestone 1).

All endpoints existed before the migration and are classified as origin_and_target.
Tests verify the API contract is preserved across the TypeScript migration.
"""
import os
import uuid
import datetime
import requests
import pytest

BASE_URL = f"http://localhost:{os.environ.get('PORT', '8000')}"
MONGO_URI = os.environ.get("DATABASE_URI", "mongodb://localhost:27017/mediahub")
NS = f"ftrun_{uuid.uuid4().hex[:8]}"


@pytest.fixture(autouse=True)
def health_check():
    """Confirm the app is reachable before running tests."""
    resp = requests.get(f"{BASE_URL}/health-123", timeout=5)
    assert resp.status_code == 200, f"Health check failed: {resp.status_code}"


@pytest.fixture(scope="module")
def mongo_db():
    """Get a pymongo database for seeding/cleanup."""
    from pymongo import MongoClient

    client = MongoClient(MONGO_URI)
    db = client.get_default_database()
    if db is None:
        db = client["mediahub"]
    yield db
    client.close()


@pytest.fixture
def seeded_video(mongo_db):
    """Insert a test video record directly into MongoDB for GET tests."""
    video_doc = {
        "title": f"{NS}_test_video",
        "description": f"Test video for functional testing {NS}",
        "videoPath": f"/uploads/videos/{NS}/index.m3u8",
        "thumbnailPath": f"/uploads/videos/{NS}/thumbnail.jpg",
        "uploaderId": f"{NS}_tester",
        "duration": 10,
        "views": 0,
        "uploadDate": datetime.datetime.utcnow(),
    }
    result = mongo_db.videos.insert_one(video_doc)
    video_id = str(result.inserted_id)
    yield {
        "id": video_id,
        "uploaderId": video_doc["uploaderId"],
        "title": video_doc["title"],
    }
    # Cleanup - safe even if already deleted
    mongo_db.videos.delete_one({"_id": result.inserted_id})


@pytest.fixture
def seeded_video_for_delete(mongo_db):
    """Insert a video record specifically for the successful delete test."""
    unique = uuid.uuid4().hex[:8]
    video_doc = {
        "title": f"{NS}_delete_{unique}",
        "description": f"Video for delete test {NS}",
        "videoPath": f"/uploads/videos/{NS}_del_{unique}/index.m3u8",
        "thumbnailPath": f"/uploads/videos/{NS}_del_{unique}/thumbnail.jpg",
        "uploaderId": f"{NS}_delete_tester",
        "duration": 5,
        "views": 0,
        "uploadDate": datetime.datetime.utcnow(),
    }
    result = mongo_db.videos.insert_one(video_doc)
    video_id = str(result.inserted_id)
    yield {"id": video_id, "uploaderId": video_doc["uploaderId"]}
    mongo_db.videos.delete_one({"_id": result.inserted_id})


class TestHealthEndpoint:
    """GET /health-123 - health check endpoint."""

    def test_health_returns_200_hello_world(self):
        resp = requests.get(f"{BASE_URL}/health-123", timeout=5)
        assert resp.status_code == 200
        assert resp.text == "Hello World!"


class TestListVideos:
    """GET /videos - list all videos."""

    def test_list_videos_returns_array(self):
        resp = requests.get(f"{BASE_URL}/videos", timeout=10)
        assert resp.status_code == 200
        body = resp.json()
        assert isinstance(body, list)


class TestGetVideoById:
    """GET /videos/:id - get a single video by ID."""

    def test_get_existing_video(self, seeded_video):
        resp = requests.get(
            f"{BASE_URL}/videos/{seeded_video['id']}", timeout=10
        )
        assert resp.status_code == 200
        body = resp.json()
        assert body["_id"] == seeded_video["id"]
        assert body["title"] == seeded_video["title"]

    def test_get_nonexistent_video(self):
        fake_id = "000000000000000000000000"
        resp = requests.get(f"{BASE_URL}/videos/{fake_id}", timeout=10)
        assert resp.status_code == 404
        body = resp.json()
        assert body["message"] == "Video not found"


class TestCheckIntegrity:
    """GET /check-integrity - check video file integrity."""

    def test_check_integrity_returns_summary(self):
        resp = requests.get(f"{BASE_URL}/check-integrity", timeout=10)
        assert resp.status_code == 200
        body = resp.json()
        assert "summary" in body
        assert "details" in body
        assert isinstance(body["summary"]["total"], int)
        assert isinstance(body["summary"]["good"], int)
        assert isinstance(body["summary"]["broken"], int)
        assert isinstance(body["details"], list)


class TestCleanupOrphaned:
    """DELETE /cleanup-orphaned - find/clean orphaned database records."""

    def test_cleanup_orphaned_dry_run(self):
        resp = requests.delete(f"{BASE_URL}/cleanup-orphaned", timeout=10)
        assert resp.status_code == 200
        body = resp.json()
        assert "message" in body
        assert "orphanedRecords" in body
        assert isinstance(body["orphanedRecords"], list)


class TestDeleteVideo:
    """DELETE /videos/:id - delete a video by ID."""

    def test_delete_nonexistent_video(self):
        fake_id = "000000000000000000000000"
        resp = requests.delete(
            f"{BASE_URL}/videos/{fake_id}",
            json={"uploaderId": "nobody"},
            timeout=10,
        )
        assert resp.status_code == 404
        body = resp.json()
        assert body["message"] == "Video not found"

    def test_delete_wrong_uploader(self, seeded_video):
        resp = requests.delete(
            f"{BASE_URL}/videos/{seeded_video['id']}",
            json={"uploaderId": "wrong_person"},
            timeout=10,
        )
        assert resp.status_code == 403
        body = resp.json()
        assert body["message"] == "You can only delete your own videos"

    def test_delete_with_correct_uploader(self, seeded_video_for_delete):
        resp = requests.delete(
            f"{BASE_URL}/videos/{seeded_video_for_delete['id']}",
            json={"uploaderId": seeded_video_for_delete["uploaderId"]},
            timeout=10,
        )
        # Seeded video has no files on disk, fs.existsSync returns false,
        # so rmSync is skipped. Delete should succeed with 200.
        assert resp.status_code == 200
        body = resp.json()
        assert body["message"] == "Video deleted successfully"
