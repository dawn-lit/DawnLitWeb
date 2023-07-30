import { Component } from '@angular/core';
import { Post, User } from "../utility.models";
import { HttpService } from "../http.service";
import { ActivatedRoute } from "@angular/router";
import { FriendshipStatus } from "../utility.enums";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileUserId: number = 0;
  profileUserData: User = {} as User;
  currentUserData: User = {} as User;
  currentActive: string = "posts";
  protected readonly FriendshipStatus = FriendshipStatus;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      let _id = params.get("id");
      this.profileUserId = _id != null ? Number(_id) : 0;
      this.initUserData();
    });
  }

  initUserData(): void {
    if (this.profileUserId > 0) {
      this._httpService.getUser(this.profileUserId).subscribe(data => {
        if (data != null && Object.keys(data).length > 0) {
          this.profileUserData = data;
          this.profileUserData.posts = [];
          this.profileUserData.createdAt = new Date(this.profileUserData.createdAt);
          this._httpService.getPosts(10, this.profileUserData.id).subscribe(data => {
            this.profileUserData.posts = data as Array<Post>;
          });
        }
      });
    }
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.currentUserData = data;
      }
    });
  }

  isLookingAtOwnPage() {
    return this.currentUserData.id != null && this.currentUserData.id == this.profileUserData.id;
  }

  getActiveStatus(category: string) {
    return this.currentActive == category ? "active" : "";
  }

  setActiveCategory(category: string) {
    this.currentActive = category;
  }

  getFriendShipStatus() {
    if (this.currentUserData.friends == null || this.profileUserData.friends == null) {
      return FriendshipStatus.UnClear;
    } else if (this.currentUserData.friends.some(f => f.id == this.profileUserData.id)) {
      return FriendshipStatus.AreFriends;
    } else if (this.profileUserData.requests.some(r => r.sender.id == this.currentUserData.id)) {
      return FriendshipStatus.RequestSent;
    }
    return FriendshipStatus.NoRequestSent;
  }

  sendRequest() {
    this._httpService.sendFriendRequest(this.profileUserData).subscribe(() => {
      this.initUserData();
    });
  }
}
