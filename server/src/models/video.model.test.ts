import { describe, it, expect } from 'vitest';
import { Video } from './video.model.js';

describe('Video model schema', () => {
  it('should create a Video with valid data', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    const errors = video.validateSync();
    expect(errors).toBeUndefined();
    expect(video.title).toBe('Test Video');
    expect(video.videoPath).toBe('/videos/test.mp4');
  });

  it('should apply default values', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.description).toBeUndefined();
    expect(video.thumbnailPath).toBeUndefined();
    expect(video.uploaderId).toBeUndefined();
    expect(video.duration).toBe(0);
    expect(video.views).toBe(0);
    expect(video.uploadDate).toBeInstanceOf(Date);
  });

  it('should require title', () => {
    const video = new Video({
      videoPath: '/videos/test.mp4',
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('title');
  });

  it('should require videoPath', () => {
    const video = new Video({
      title: 'Test Video',
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('videoPath');
  });

  it('should default duration to 0', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.duration).toBe(0);
  });

  it('should default views to 0', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
    });

    expect(video.views).toBe(0);
  });

  it('should reject negative views', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
      views: -1,
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('views');
  });

  it('should reject negative duration', () => {
    const video = new Video({
      title: 'Test Video',
      videoPath: '/videos/test.mp4',
      duration: -5,
    });

    const errors = video.validateSync();
    expect(errors).toBeDefined();
    expect(errors!.errors).toHaveProperty('duration');
  });
});
