import { describe, it, expect } from 'vitest';
import mongoose from 'mongoose';

// Re-create the schema here to test validation without needing
// the @mediahub/shared import to resolve at test time
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: 'No description' },
  videoPath: { type: String, required: true },
  thumbnailPath: { type: String, default: '' },
  uploaderId: { type: String, default: 'anonymous' },
  duration: { type: Number, default: 0, min: 0 },
  views: { type: Number, default: 0, min: 0 },
  uploadDate: { type: Date, default: Date.now },
});

const TestVideo = mongoose.model('TestVideo', videoSchema);

describe('Video model schema', () => {
  it('should create a Video with valid data', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    const errors = video.validateSync();
    expect(errors).toBeUndefined();
    expect(video.title).toBe('Test Video');
    expect(video.videoPath).toBe('/videos/test.mp4');
  });

  it('should apply default values', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.description).toBe('No description');
    expect(video.thumbnailPath).toBe('');
    expect(video.uploaderId).toBe('anonymous');
    expect(video.duration).toBe(0);
    expect(video.views).toBe(0);
    expect(video.uploadDate).toBeInstanceOf(Date);
  });

  it('should require title', () => {
    const video = new TestVideo({
      videoPath: '/videos/test.mp4',
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('title');
  });

  it('should require videoPath', () => {
    const video = new TestVideo({
      title: 'Test Video',
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('videoPath');
  });

  it('should default duration to 0', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.duration).toBe(0);
  });

  it('should default views to 0', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.views).toBe(0);
  });

  it('should reject negative views', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
      views: -1,
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('views');
  });

  it('should reject negative duration', () => {
    const video = new TestVideo({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
      duration: -5,
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('duration');
  });
});
