import { Component } from '@angular/core';
import { Post, User } from "../utility.models";
import { HttpService } from "../http.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userData: User = {} as User;
  allPosts: Array<Post> = new Array<Post>();

  constructor(
    private _httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.getAllPosts();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.userData = data;
      }
    });
  }

  getAllPosts(): void {
    this._httpService.getPosts(100).subscribe(data => {
      this.allPosts = data;
    });
  }
}
