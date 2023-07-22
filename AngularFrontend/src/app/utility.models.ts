export interface User {
  id: number;
  avatar: any;
  name: string;
  email: string;
  group: number;
  loginIp: string;
  friends: Array<User>;
  comments: Array<Comment>;
  coins: number;
  experience: number;
  signature: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  content: string;
  author: User;
  permission: number;
  comments: Array<Comment>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  replies: Array<Comment>;
  author: User;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}
