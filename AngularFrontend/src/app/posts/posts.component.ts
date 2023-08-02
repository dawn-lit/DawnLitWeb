import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment, Discussion, Post, User, UserDummy } from "../utility.models";
import { HttpService } from "../http.service";
import { ContentValidation } from "../utility.validations";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { getExistenceTime } from "../utility.functions";

declare var $: any;

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {

  @Input() posts: Array<Post> = [];
  @Input() enablePost: boolean = false;
  @Input() userData: User | null = null;
  @Output() childEvent: EventEmitter<any> = new EventEmitter();

  readonly editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};

  newPost: Post = {"content": ""} as Post;
  newComments: Record<string, Comment> = {};
  errorMessage: Record<string, string> = {"content": ""};
  protected readonly getExistenceTime = getExistenceTime;

  constructor(
    private _httpService: HttpService
  ) {
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
      this.newPost.author = UserDummy(this.userData);
      this._httpService.createPost(this.newPost).subscribe(() => {
          // reset error message
          for (const key in this.errorMessage) {
            this.errorMessage[key] = "";
          }
          this.newPost["content"] = "";
          // make parent update all the posts
          this.childEvent.emit();
          ($("#feedActionPost") as any).modal("hide");
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
      newComment.post = {id: associatePost.id} as Post;
      newComment.author = UserDummy(this.userData);
      this._httpService.createComment(newComment).subscribe(() => {
        // reset error message
        for (const key in this.errorMessage) {
          this.errorMessage[key] = "";
        }
        this._httpService.getPost(associatePost.id).subscribe(data => {
          associatePost.comments = data.comments;
          this.newComments = {};
        });
      });
    }
  }

  hasCurrentUserCommented(_post: Post): boolean {
    return this.userData != null ? _post.comments.some(comment => comment.author.id == this.userData!.id) : false;
  }

  hasCurrentUserLiked(_content: Discussion): boolean {
    return this.userData != null ? _content.likedBy.some(user => user.id == this.userData!.id) : false;
  }

  likePost(thePost: Post) {
    this._httpService.likeContent(thePost, "post").subscribe(() => {
      this._httpService.getPost(thePost.id).subscribe(data => {
        thePost.likedBy = data.likedBy;
      });
    });
  }

  likeComment(theComment: Comment) {
    this._httpService.likeContent(theComment, "comment").subscribe(() => {
      this._httpService.getComment(theComment.id).subscribe(data => {
        theComment.likedBy = data.likedBy;
      });
    });
  }
}
