import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Comment, Content, Post } from "./utility.models";
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
    return this._http.get('https://jsonip.com');
  }

  // ensure no user is login already
  ensureNotLoginAlready(): void {
    if (this._token.isStillValid()) {
      this.gotoHomePage();
    }
  }

  // get current user data
  getCurrentUser() {
    if (this._token.isStillValid()) {
      return this._http.get("/api/users/current");
    }
    return new Observable<Object>();
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
    return this._http.get(`/api/users/get/${id}`);
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
  logoffUser() {
    localStorage.removeItem("jwt_token");
    return new Observable<Object>();
  }

  // delete current user's account
  deleteUser() {
    return this._http.delete("/api/users/delete");
  }

  // create a new post
  createPost(data: Post) {
    return this._http.post(`/api/posts/new`, data);
  }

  // get post with specific id
  getPost(id: number) {
    return this._http.get(`/api/posts/get/${id}`);
  }

  // get a list of posts
  getPosts(num: number) {
    return this._http.get(`/api/posts/get/list/${num}`);
  }

  // create a new comment
  createComment(data: Comment) {
    return this._http.post(`/api/comments/new`, data);
  }

  // like a content
  likeContent(theContent: Content, contentType: string) {
    return this._http.post(`/api/users/like/${contentType}`, theContent);
  }
}
