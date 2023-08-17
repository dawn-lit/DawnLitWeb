import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Blog, Discussion, Post, PostComment, User, UserDummy } from "../utility.models";
import { HttpService } from "../http.service";
import { ContentValidation } from "../utility.validations";
import { AngularEditorConfig } from "@kolkov/angular-editor";
import { getExistenceTime, Theme } from "../utility.functions";
import { Router } from "@angular/router";

declare var $: any;

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {

  // inputs from parent
  @Input() posts: Array<Post> = [];
  @Input() enablePost: boolean = false;
  @Input() userData: User | null = null;
  @Output() updatePostsEvent: EventEmitter<any> = new EventEmitter();
  @Output() updateBlogsEvent: EventEmitter<any> = new EventEmitter();
  // protected local variables
  protected newPost: Post = {content: ""} as Post;
  protected postToEditTempDummy: Post = {content: ""} as Post;
  protected newBlog: Blog = {title: "", content: ""} as Blog;
  protected postErrorMessage: Record<string, string> = {};
  protected blogErrorMessage: Record<string, string> = {};
  // readonly properties
  protected readonly editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};
  protected readonly getExistenceTime = getExistenceTime;
  protected readonly Theme = Theme;
  // private ts local variables
  private postToEdit: Post = {} as Post;
  private newComments: Record<string, PostComment> = {};

  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) {
  }

  obtainCommentTemplate(associatePost: Post) {
    if (!(associatePost.id in this.newComments)) {
      this.newComments[associatePost.id] = {content: ""} as PostComment;
    }
    return this.newComments[associatePost.id];
  }

  // check the post before sending it to server
  checkPost(thePost: Post): boolean {
    // reset current error message(s)
    this.postErrorMessage = {};
    // get errors
    const errors: Map<string, string> = ContentValidation.check(thePost);
    // check if form has error
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.postErrorMessage[key] = value;
      });
      return false;
    }
    return true;
  }

  createPost() {
    if (this.checkPost(this.newPost)) {
      this.newPost.author = UserDummy(this.userData);
      this._httpService.createPost(this.newPost).subscribe(() => {
          this.newPost["content"] = "";
          // make parent update all the posts
          this.updatePostsEvent.emit();
          ($("#feedActionPost") as any).modal("hide");
        }
      );
    }
  }

  updatePostToEdit(_post: Post) {
    this.postToEdit = _post;
    this.postToEditTempDummy.content = _post.content;
  }

  updatePost() {
    if (this.checkPost(this.postToEditTempDummy)) {
      this.postToEdit.content = this.postToEditTempDummy.content;
      this._httpService.updatePost(this.postToEdit)
        .subscribe(() => ($("#feedActionEditPost") as any).modal("hide"));
    }
  }

  createBlog() {
    // reset current error message(s)
    this.blogErrorMessage = {};
    // get errors
    const errors: Map<string, string> = ContentValidation.check(this.newBlog);
    // check if form has error
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.blogErrorMessage[key] = value;
      });
    } else {
      this.newBlog.author = UserDummy(this.userData);
      this._httpService.createBlog(this.newBlog).subscribe((resp: any) => {
          this.newBlog["content"] = "";
          // make parent update all the blogs
          this.updateBlogsEvent.emit();
          ($("#feedActionBlog") as any).modal("hide");
          this._router.navigateByUrl(`/blog?id=${resp.id}`).then(() => {
          });
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

  deletePost(thePost: Post) {
    if (confirm('Are you sure you want to delete this post?')) {
      this._httpService.deletePost(thePost).subscribe(() => {
        this.posts = this.posts.filter(item => item.id != thePost.id);
      });
    }
  }
}
