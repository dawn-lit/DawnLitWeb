export interface DatabaseRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends DatabaseRecord {
  avatar: any;
  name: string;
  email: string;
  group: number;
  loginIp: string;
  friends: Array<User>;
  requests: Array<Request>;
  chats: Array<Chat>;
  posts: Array<Post>;
  likedPosts: Array<Post>;
  comments: Array<Comment>;
  likedComments: Array<Comment>;
  coins: number;
  experience: number;
  signature: string;
  about: string;
}

export interface Request extends DatabaseRecord {
  sender: User;
  type: string;
}

export interface Chat extends DatabaseRecord {
  owner: User;
  target: User;
  messages: Array<Message>;
}

export interface Message extends DatabaseRecord {
  chat: Chat;
  sender: User;
  content: string;
}

export interface Discussion extends DatabaseRecord {
  author: User;
  content: string;
  likedBy: Array<User>;
}

export interface Post extends Discussion {
  comments: Array<Comment>;
}

export interface Comment extends Discussion {
  post: Post;
  replies: Array<Comment>;
}
