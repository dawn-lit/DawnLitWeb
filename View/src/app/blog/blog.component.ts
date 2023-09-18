import { Component } from '@angular/core';
import { HttpService } from "../http.service";
import { Blog, BlogComment, BlogDummy, User, UserDummy } from "../utility.models";
import { map } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { getDateString, Theme } from "../utility.functions";
import { ContentValidation } from "../utility.validations";
import { AngularEditorConfig } from "@kolkov/angular-editor";

declare var $: any;

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  // protected local variables
  protected currentUser: User | null = null;
  protected blog: Blog | null = null;
  protected newComment: BlogComment = {content: ""} as BlogComment;
  protected newCommentErrorMessage: Record<string, string> = {"content": ""};
  protected blogToEditTempDummy: Blog = {title: "", content: ""} as Blog;
  protected blogErrorMessage: Record<string, string> = {"title": "", "content": ""};
  protected isBlocked = false;
  // readonly properties
  protected readonly editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};
  protected readonly getDateString = getDateString;
  protected readonly Theme = Theme;

  constructor(
    private _httpService: HttpService,
    private _route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this._route.queryParamMap.subscribe(params => {
      let _id = params.get("id");
      if (_id != null) {
        this.getBlog(Number(_id));
      }
    });
    this.getCurrentUser();
  }

  getCurrentUser(): void {
    this._httpService.getCurrentUser()
      .pipe(map(data => this.currentUser = data)).subscribe();
  }

  getBlog(blogId: number): void {
    this._httpService.getBlog(blogId).pipe(map(data => this.blog = data)).subscribe();
  }

  createComment() {
    if (this.blog == null || this.isBlocked) return;
    const errors: Map<string, string> = ContentValidation.check(this.newComment);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.newCommentErrorMessage[key] = value;
      });
    } else {
      this.newComment.blog = BlogDummy(this.blog);
      this.newComment.author = UserDummy(this.currentUser);
      this.isBlocked = true;
      this._httpService.createBlogComment(this.newComment).subscribe(() => {
        // reset error message
        for (const key in this.newCommentErrorMessage) {
          this.newCommentErrorMessage[key] = "";
        }
        this.newComment.content = "";
        this.getBlog(this.blog!.id);
        this.isBlocked = false;
      });
    }
  }

  deleteBlog(theBlog: Blog) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this._httpService.deleteBlog(theBlog).subscribe(() => this._httpService.gotoHomePage());
    }
  }

  updateBlogToEdit(theBlog: Blog) {
    this.blogToEditTempDummy.title = theBlog.title;
    this.blogToEditTempDummy.content = theBlog.content;
  }

  updateBlog() {
    if (this.blog == null || this.isBlocked) return;
    this.blog.title = this.blogToEditTempDummy.title;
    this.blog.content = this.blogToEditTempDummy.content;
    this.isBlocked = true;
    this._httpService.updateBlog(this.blog)
      .subscribe(() => {
        ($("#feedActionEditBlog") as any).modal("hide");
        this.isBlocked = false;
      });
  }
}
