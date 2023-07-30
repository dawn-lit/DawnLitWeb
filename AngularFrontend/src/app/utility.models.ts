export interface User {
  id: number;
  avatar: any;
  name: string;
  email: string;
  group: number;
  loginIp: string;
  friends: Array<User>;
  requests: Array<Request>;
  posts: Array<Post>;
  likedPosts: Array<Post>;
  comments: Array<Comment>;
  likedComments: Array<Comment>;
  coins: number;
  experience: number;
  signature: string;
  about: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: number;
  sender: User;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discussion {
  id: number;
  author: User;
  content: string;
  likedBy: Array<User>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post extends Discussion {
  comments: Array<Comment>;
}

export interface Comment extends Discussion {
  post: Post;
  replies: Array<Comment>;
}
