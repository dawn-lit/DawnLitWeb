import { Component } from '@angular/core';
import { Blog, Post, User } from "../utility.models";
import { HttpService } from "../http.service";
import { FriendshipStatus } from "../utility.enums";
import { map } from "rxjs";
import { getExistenceTime } from "../utility.functions";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userData: User | null = null;
  userRecentlyCrated: Array<User> = [];
  allPosts: Array<Post> = new Array<Post>();
  announcements: Array<Blog> = new Array<Blog>();
  protected readonly FriendshipStatus = FriendshipStatus;
  protected readonly getExistenceTime = getExistenceTime;

  constructor(
    private _httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.getAllPosts();
    this.getAnnouncements();
    this.getUserRecentlyCreated();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().pipe(map(data => this.userData = data)).subscribe();
  }

  getAllPosts(): void {
    this._httpService.getPosts(100).pipe(map(data => this.allPosts = data)).subscribe();
  }

  getAnnouncements(): void {
    this._httpService.getAnnouncements(5).pipe(map(data => this.announcements = data)).subscribe();
  }

  getUserRecentlyCreated() {
    this._httpService.getUsers(5).pipe(map(data => this.userRecentlyCrated = data)).subscribe();
  }

  getFriendShipStatus(targetUser: User) {
    return FriendshipStatus.getStatus(this.userData, targetUser);
  }

  sendFriendRequest(targetUser: User) {
    this._httpService.sendFriendRequest(targetUser).subscribe(() => {
      this._httpService.getUser(targetUser.id).subscribe(data => {
        targetUser.friends = data.friends;
        targetUser.requests = data.requests;
      });
    });
  }
}
