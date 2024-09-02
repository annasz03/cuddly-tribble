export interface Post {
  id: string;
  postBody: string;
  like: number;
  comment: number;
  postedBy: string;
  date: Date;
  views: number;
  postPic: string | null;
  postImage: Blob;
  picFileName: string;
  description?:string;
}