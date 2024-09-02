export interface Posts {
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
    description?: string;
  }

  export interface Users {
    id: string;
    name: string;
    birth?: string | null;
    profilePic?: string | null;
    followers: number;
    username: string;
    created_at: string | null;
    password: string;
    email: string;
    bio?: string;
    header?: string | null;
  }
  