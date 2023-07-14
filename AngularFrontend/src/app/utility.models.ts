export interface User {
  id: number;
  avatar: any;
  name: string;
  email: string;
  group: number;
  registerIp: string;
  loginIp: string;
  friends: Array<User>;
  comments: Array<Comment>;
  coins: number;
  experience: number;
  signature: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostField {
  id: number;
  name: string;
  image: string;
  permission: number;
  count: number;
  latestPost: Post;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  field: PostField;
  author: User;
  permission: number;
  comments: Array<Comment>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  field: PostField;
  post: Post;
  createdAt: Date;
  updatedAt: Date;
}
