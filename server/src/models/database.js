import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: String,
    description: String,
    videoPath: String,
    thumbnailPath: String,
    uploaderId: String,
    duration: { type: Number, default: 0 }, // Duration in seconds
    views: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },
});
export const Video = mongoose.model("Video", videoSchema);
