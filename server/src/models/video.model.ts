import mongoose, { Schema, Model } from 'mongoose';
import type { IVideo } from '@mediahub/shared';

const videoSchema = new Schema<IVideo>(
  {
    title: { type: String, required: true },
    description: { type: String, default: 'No description' },
    videoPath: { type: String, required: true },
    thumbnailPath: { type: String, default: '' },
    uploaderId: { type: String, default: 'anonymous' },
    duration: { type: Number, default: 0, min: 0 },
    views: { type: Number, default: 0, min: 0 },
    uploadDate: { type: Date, default: Date.now },
  },
);

export const Video: Model<IVideo> = mongoose.model<IVideo>('Video', videoSchema);
