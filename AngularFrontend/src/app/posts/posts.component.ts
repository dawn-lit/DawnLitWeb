import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Blog, Discussion, Post, PostComment, User, UserDummy } from "../utility.models";
import { HttpService } from "../http.service";
import { ContentValidation } from "../utility.validations";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { getExistenceTime, Theme } from "../utility.functions";

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

  newPost: Post = {content: ""} as Post;
  newBlog: Blog = {title: "", content: ""} as Blog;
  newComments: Record<string, PostComment> = {};
  postErrorMessage: Record<string, string> = {"title": "", "content": ""};
  blogErrorMessage: Record<string, string> = {"content": ""};
  protected readonly getExistenceTime = getExistenceTime;
  protected readonly Theme = Theme;

  constructor(
    private _httpService: HttpService
  ) {
  }

  obtainCommentTemplate(associatePost: Post) {
    if (!(associatePost.id in this.newComments)) {
      this.newComments[associatePost.id] = {content: ""} as PostComment;
    }
    return this.newComments[associatePost.id];
  }

  createPost() {
    const errors: Map<string, string> = ContentValidation.check(this.newPost);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.postErrorMessage[key] = value;
      });
    } else {
      this.newPost.author = UserDummy(this.userData);
      this._httpService.createPost(this.newPost).subscribe(() => {
          // reset error message
          for (const key in this.postErrorMessage) {
            this.postErrorMessage[key] = "";
          }
          this.newPost["content"] = "";
          // make parent update all the posts
          this.childEvent.emit();
          ($("#feedActionPost") as any).modal("hide");
        }
      );
    }
  }

  createBlog() {
    const errors: Map<string, string> = ContentValidation.check(this.newBlog);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.blogErrorMessage[key] = value;
      });
    } else {
      this.newBlog.author = UserDummy(this.userData);
      this._httpService.createBlog(this.newBlog).subscribe(() => {
          // reset error message
          for (const key in this.blogErrorMessage) {
            this.blogErrorMessage[key] = "";
          }
          this.newBlog["content"] = "";
          // make parent update all the blogs
          this.childEvent.emit();
          ($("#feedActionBlog") as any).modal("hide");
        }
      );
    }
  }

  createComment(associatePost: Post) {
    const newComment = this.obtainCommentTemplate(associatePost);
    const errors: Map<string, string> = ContentValidation.check(newComment);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.postErrorMessage[key] = value;
      });
    } else {
      newComment.post = {id: associatePost.id} as Post;
      newComment.author = UserDummy(this.userData);
      this._httpService.createPostComment(newComment).subscribe(() => {
        // reset error message
        for (const key in this.postErrorMessage) {
          this.postErrorMessage[key] = "";
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
    if (this.userData == null) {
      return;
    }
    this._httpService.likePost(thePost).subscribe(() => {
      this._httpService.getPost(thePost.id).subscribe(data => {
        thePost.likedBy = data.likedBy;
      });
    });
  }

  likeComment(theComment: PostComment) {
    if (this.userData == null) {
      return;
    }
    this._httpService.likePostComment(theComment).subscribe(() => {
      this._httpService.getPostComment(theComment.id).subscribe(data => {
        theComment.likedBy = data.likedBy;
      });
    });
  }
}
