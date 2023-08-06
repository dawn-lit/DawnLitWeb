export interface DatabaseRecord {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends DatabaseRecord {
  name: string;
  email: string;
  github: string;
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

export function UserDummy(user: User | null): User {
  return (user == null ? {} : {id: user.id}) as User;
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

export function ChatDummy(chat: Chat): Chat {
  return {id: chat.id, owner: UserDummy(chat.owner), target: UserDummy(chat.target)} as Chat;
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

export interface Blog extends Post {
  title: string;
}
