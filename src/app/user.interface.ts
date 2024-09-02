export interface UserInterface {
    id: string;
    name: string;
    email?: string;
    birth?: string | null;
    username?: string;
    profilePic?: string | null;
    followers?: number;
    password?: string;
    token?: string;
    postImageUrl?: string;
    header?: string | null;
    created_at?: string | null;
    bio?: string;
    profilePicUrl?: string; 
  }