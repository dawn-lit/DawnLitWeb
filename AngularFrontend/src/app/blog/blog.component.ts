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
  userData: User | null = null;
  blog: Blog | null = null;
  newComment: BlogComment = {content: ""} as BlogComment;
  newCommentErrorMessage: Record<string, string> = {"content": ""};
  blogToEdit: Blog = {content: ""} as Blog;
  readonly editorConfig: AngularEditorConfig = {minHeight: '10rem', editable: true};
  blogErrorMessage: Record<string, string> = {"title": "", "content": ""};
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
    this.getUserData();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().pipe(map(data => this.userData = data)).subscribe();
  }

  getBlog(blogId: number): void {
    this._httpService.getBlog(blogId).pipe(map(data => this.blog = data)).subscribe();
  }

  createComment() {
    if (this.blog == null) {
      return;
    }
    const errors: Map<string, string> = ContentValidation.check(this.newComment);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.newCommentErrorMessage[key] = value;
      });
    } else {
      this.newComment.blog = BlogDummy(this.blog);
      this.newComment.author = UserDummy(this.userData);
      this._httpService.createBlogComment(this.newComment).subscribe(() => {
        // reset error message
        for (const key in this.newCommentErrorMessage) {
          this.newCommentErrorMessage[key] = "";
        }
        this.newComment.content = "";
        this.getBlog(this.blog!.id);
      });
    }
  }

  deleteBlog(theBlog: Blog) {
    if (confirm('Are you sure you want to delete this blog?')) {
      this._httpService.deleteBlog(theBlog).subscribe(() => this._httpService.gotoHomePage());
    }
  }

  updateBlog() {
    this._httpService.updateBlog(this.blogToEdit)
      .subscribe(() => ($("#feedActionEditBlog") as any).modal("hide"));
  }
}
