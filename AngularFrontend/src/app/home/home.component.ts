import { Component } from '@angular/core';
import { Comment, Content, Post, User } from "../utility.models";
import { HttpService } from "../http.service";
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ContentValidation } from "../utility.validations";

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userData: User = {} as User;
  readonly editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};
  newPost: Post = {} as Post;
  newComments: Record<string, Comment> = {};
  allPosts: Array<Post> = new Array<Post>();
  errorMessage: Record<string, string> = {
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
        this.userData = data as User;
        this.newPost.author = this.userData;
        this.newPost.content = "";
      }
    });
  }

  getAllPosts(): void {
    this._httpService.getPosts(100).subscribe(data => {
      this.allPosts = data as Array<Post>;
      ($("#feedActionPost") as any).modal("hide");
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
        this.errorMessage[key] = value;
      });
    } else {
      this.newPost.author = {id: this.userData.id} as User;
      this._httpService.createPost(this.newPost).subscribe(() => {
          // reset error message
          for (const key in this.errorMessage) {
            this.errorMessage[key] = "";
          }
          this.getAllPosts();
        }
      );
    }
  }

  createComment(associatePost: Post) {
    const newComment = this.obtainCommentTemplate(associatePost);
    const errors: Map<string, string> = ContentValidation.check(newComment);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.errorMessage[key] = value;
      });
    } else {
      newComment.post = {id: associatePost.id, author: {id: associatePost.author.id} as User} as Post;
      newComment.author = {id: this.userData.id} as User;
      this._httpService.createComment(newComment).subscribe(() => {
        // reset error message
        for (const key in this.errorMessage) {
          this.errorMessage[key] = "";
        }
        this._httpService.getPost(associatePost.id).subscribe(data => {
          associatePost.comments = (data as Post).comments;
          this.newComments = {};
        });
      });
    }
  }

  getContentTime(content: Content): string {
    let timeDiff = (new Date().getTime() - new Date(content.createdAt).getTime()) / 1000;
    if (timeDiff >= 31536000) {
      return `${Math.round(timeDiff / 31536000)}yr`;
    } else if (timeDiff >= 2592000) {
      return `${Math.round(timeDiff / 2592000)}mon`;
    } else if (timeDiff >= 86400) {
      return `${Math.round(timeDiff / 86400)}d`;
    } else if (timeDiff >= 3600) {
      return `${Math.round(timeDiff / 3600)}hr`;
    }
    return `${Math.max(Math.round(timeDiff / 60), 1)}min`;
  }

  hasCurrentUserCommented(_post: Post): boolean {
    return this.userData.id != null ? _post.comments.some(comment => comment.author.id == this.userData.id) : false;
  }

  hasCurrentUserLiked(_content: Content): boolean {
    return this.userData.id != null ? _content.likedBy.some(user => user.id == this.userData.id) : false;
  }

  likePost(thePost: Post) {
    this._httpService.likeContent(thePost, "post").subscribe(() => {
      this._httpService.getPost(thePost.id).subscribe(data => {
        thePost.likedBy = (data as Post).likedBy;
      });
    });
  }

  likeComment(theComment: Comment) {
    this._httpService.likeContent(theComment, "comment").subscribe(() => {
      this._httpService.getComment(theComment.id).subscribe(data => {
        theComment.likedBy = (data as Comment).likedBy;
      });
    });
  }
}
