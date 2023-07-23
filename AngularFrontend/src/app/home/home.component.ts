import { Component } from '@angular/core';
import { Comment, Post, User } from "../utility.models";
import { HttpService } from "../http.service";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContentValidation } from "../utility.validations";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  UserData: User = {} as User;
  editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};
  newPost: Post = {} as Post;
  newComments: Record<string, Comment> = {};
  allPosts: Array<Post> = new Array<Post>();
  ErrorMessage: Record<string, string> = {
    "content": ""
  };

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
        this.UserData = data as User;
        this.newPost.author = this.UserData;
        this.newPost.content = "";
        console.log(this.UserData);
      }
    });
  }

  getAllPosts(): void {
    this._httpService.getPosts(10).subscribe(data => {
      this.allPosts = data as Array<Post>;
      console.log(this.allPosts);
    });
  }

  obtainCommentTemplate(associatePost: Post) {
    if (!(associatePost.id in this.newComments)) {
      this.newComments[associatePost.id] = {content: ""} as Comment;
    }
    return this.newComments[associatePost.id];
  }

  createPost() {
    const errors: Map<string, string> = ContentValidation.check(this.newPost);

    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.ErrorMessage[key] = value;
      });
    } else {
      this._httpService.createPost(this.newPost).subscribe(data => {
          console.log(data);
          // reset error message
          for (const key in this.ErrorMessage) {
            this.ErrorMessage[key] = "";
          }
          window.location.reload();
        }
      );
    }
  }

  createComments(associatePost: Post) {
    const newComment = this.obtainCommentTemplate(associatePost);
    const errors: Map<string, string> = ContentValidation.check(newComment);
    console.log(this.newComments);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.ErrorMessage[key] = value;
      });
    } else {
      newComment.post = associatePost;
      newComment.author = this.UserData;
      this._httpService.createComment(newComment).subscribe(data => {
          console.log(data);
          // reset error message
          for (const key in this.ErrorMessage) {
            this.ErrorMessage[key] = "";
          }
          window.location.reload();
        }
      );
    }
  }
}
