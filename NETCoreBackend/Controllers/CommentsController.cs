using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly BlogCommentsService _blogCommentsService;
    private readonly PostCommentsService _postCommentsService;

    public CommentsController(DatabaseContext db)
    {
        this._postCommentsService = new PostCommentsService(db);
        this._blogCommentsService = new BlogCommentsService(db);
    }

    [HttpGet("post/get/{id:int}")]
    public async Task<ActionResult<PostComment>> PostCommentGet(int id)
    {
        PostComment? comment = await this._postCommentsService.GetAsync(id);

        if (comment is null)
        {
            return this.NotFound();
        }

        return comment;
    }

    [HttpPost("post/new")]
    public async Task<IActionResult> PostCommentPost(PostComment newPostComment)
    {
        // create the post
        if (await this._postCommentsService.CreateAsync(newPostComment))
        {
            return this.Accepted(new { id = newPostComment.Id });
        }

        return this.Conflict();
    }

    [HttpDelete("post/delete/{id:int}")]
    public async Task<IActionResult> PostCommentDelete(int id)
    {
        bool result = await this._postCommentsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }

    [HttpPost("blog/new")]
    public async Task<IActionResult> BlogCommentPost(BlogComment newPostComment)
    {
        // create the post
        if (await this._blogCommentsService.CreateAsync(newPostComment))
        {
            return this.Accepted(new { id = newPostComment.Id });
        }

        return this.Conflict();
    }

    [HttpDelete("blog/delete/{id:int}")]
    public async Task<IActionResult> BlogCommentDelete(int id)
    {
        bool result = await this._blogCommentsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}