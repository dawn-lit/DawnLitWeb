export interface User {
  id: number;
  avatar: any;
  name: string;
  email: string;
  group: number;
  loginIp: string;
  friends: Array<User>;
  posts: Array<Post>;
  likedPosts: Array<Post>;
  comments: Array<Comment>;
  likedComments: Array<Comment>;
  coins: number;
  experience: number;
  signature: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  id: number;
  content: string;
  author: User;
  likedBy: Array<User>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post extends Content {
  permission: number;
  comments: Array<Comment>;
}

export interface Comment extends Content {
  replies: Array<Comment>;
  post: Post;
}
