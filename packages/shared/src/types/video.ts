export interface IVideo {
  title: string;
  description: string;
  videoPath: string;
  thumbnailPath: string;
  uploaderId: string;
  duration: number;
  views: number;
  uploadDate: Date;
}

export interface IVideoDocument extends IVideo {
  _id: string;
}
