import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Comment, Post } from "./utility.models";
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

  getIpInfo(): Observable<any> {
    return this._http.get('https://jsonip.com');
  }

  //确保用户没有登录
  ensureNotLoginAlready(): void {
    if (this._token.isStillValid()) {
      this.gotoHomePage();
    }
  }

  //获取当前用户的详细数据
  getCurrentUser() {
    if (this._token.isStillValid()) {
      return this._http.get("/api/users/current");
    }
    return new Observable<Object>();
  }

  //回到主页面
  gotoHomePage(): void {
    this._router.navigate(['/']).then(() => {
    });
  }

  //新建一个用户
  registerUser(data: any) {
    return this._http.post("/api/users/new", data);
  }

  //获取一个用户的信息
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
    //return this._http.get("/api/users/logoff");
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

  //获取对应帖子信息
  getPost(id: number, complete: boolean = false) {
    if (!complete) {
      return this._http.get(`/api/posts/get/${id}`);
    } else {
      return this._http.get(`/api/posts/get/complete/${id}`);
    }
  }

  //获取帖子总数
  getPostsNum() {
    return this._http.get(`/api/posts/count`);
  }

  //获取最新的帖子
  getLatestPosts() {
    return this._http.get(`/api/posts/get/latest`);
  }

  //获取对应帖子信息
  getPosts(num: number) {
    return this._http.get(`/api/posts/get/list/${num}`);
  }

  //获取最新官方贴
  getLatestOfficialPosts(num: number) {
    return this._http.get(`/api/posts/get/list/official/${num}`);
  }

  // create a new comment
  createComment(data: Comment) {
    return this._http.post(`/api/comments/new`, data);
  }

  //上传单个文件
  upload_file(image_type_index: number, file: any) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this._http.post(`api/post/file/upload/${image_type_index}`, formData, {
      reportProgress: true, observe: 'events'
    }).pipe(map(event => {
      switch (event.type) {
        case HttpEventType.UploadProgress:
          if (event.total != null) {
            file.progress = Math.round(event.loaded * 100 / event.total);
          }
          break;
        case HttpEventType.Response:
          return event;
      }
      return;
    }), catchError((error: HttpErrorResponse) => {
      file.inProgress = false;
      return of(`${file.data.name} upload failed.`);
    })).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        console.log(event.body);
      }
    });
  }

  //上传多个文件
  upload_files(image_type_index: number, files: any) {
    files.forEach((file: any) => {
      this.upload_file(image_type_index, file);
    });
  }
}
