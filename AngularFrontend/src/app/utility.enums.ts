import { User } from "./utility.models";

export enum FriendshipStatus {
  UnClear = 0,
  NoRequestSent = 1,
  RequestSent = 2,
  AreFriends = 3
}

export namespace FriendshipStatus {
  export function getStatus(user1: User | null, user2: User | null) {
    if (user1 == null || user1.friends == null || user2 == null || user2.friends == null) {
      return FriendshipStatus.UnClear;
    } else if (user1.friends.some(f => f.id == user2.id)) {
      return FriendshipStatus.AreFriends;
    } else if (user2.requests.some(r => r.sender.id == user1.id)) {
      return FriendshipStatus.RequestSent;
    }
    return FriendshipStatus.NoRequestSent;
  }
}
