import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Comment, Discussion, Post, User } from "./utility.models";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _token: TokenService,
  ) {
  }

  // get the ip of the client
  getIpInfo(): Observable<any> {
    return this._http.get<any>('https://jsonip.com');
  }

  // ensure no user is login already
  ensureNotLoginAlready(): void {
    if (this._token.isStillValid()) {
      this.logoffUser();
    }
  }

  // get current user data
  getCurrentUser(): Observable<User> {
    if (this._token.isStillValid()) {
      return this._http.get<User>("/api/users/current");
    }
    return new Observable<User>();
  }

  // navigate back to home page
  gotoHomePage(): void {
    this._router.navigate(['/']).then(() => {
    });
  }

  // register a new user
  registerUser(data: any) {
    return this._http.post("/api/users/new", data);
  }

  // get the information of a user
  getUser(id: number) {
    return this._http.get<User>(`/api/users/get/${id}`);
  }

  // update the current user's information
  updateCurrentUserInfo(data: any) {
    return this._http.put(`/api/users/update/info`, data);
  }

  // update the current user's information
  updateCurrentUserPassword(data: any) {
    return this._http.put(`/api/users/update/password`, data);
  }

  // login the user
  loginUser(data: any) {
    return this._http.post("/api/users/login", data);
  }

  // log off current user
  logoffUser(): Observable<Object> {
    localStorage.removeItem("jwt_token");
    return new Observable<Object>();
  }

  // delete current user's account
  deleteUser() {
    return this._http.delete("/api/users/delete");
  }

  // send friend request
  sendFriendRequest(targetUser: User) {
    return this._http.post("/api/users/connect/request", targetUser);
  }

  // accept friend request
  acceptFriendRequest(targetUser: User) {
    return this._http.post("/api/users/connect/accept", targetUser);
  }

  // reject friend request
  rejectFriendRequest(targetUser: User) {
    return this._http.post("/api/users/connect/reject", targetUser);
  }


  // create a new post
  createPost(data: Post) {
    return this._http.post(`/api/posts/new`, data);
  }

  // get post with specific id
  getPost(id: number): Observable<Post> {
    return this._http.get<Post>(`/api/posts/get/${id}`);
  }

  // get a list of posts
  getPosts(num: number, userId: number = 0): Observable<Array<Post>> {
    return userId <= 0 ? this._http.get<Array<Post>>(`/api/posts/get/list/${num}`) : this._http.get<Array<Post>>(`/api/posts/get/list/${userId}/${num}`);
  }

  // create a new comment
  createComment(data: Comment) {
    return this._http.post(`/api/comments/new`, data);
  }

  // get post with specific id
  getComment(id: number): Observable<Comment> {
    return this._http.get<Comment>(`/api/comments/get/${id}`);
  }

  // like a content
  likeContent(theContent: Discussion, contentType: string) {
    return this._http.post(`/api/users/like/${contentType}`, theContent);
  }
}
