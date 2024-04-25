using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController(DatabaseContext db) : AbstractUserController
{
    private readonly PostsService _postsService = new(db);

    [HttpGet("get/list/{num:int}")]
    public async Task<List<Post>> GetList(int num)
    {
        return await this._postsService.GetListAsync(num);
    }

    [HttpGet("get/list/{userId:int}/{num:int}")]
    public async Task<List<Post>> GetUserList(int userId, int num)
    {
        return await this._postsService.GetUserListAsync(userId, num);
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<Post>> Get(int id)
    {
        Post? post = await this._postsService.GetAsync(id);

        if (post is null)
        {
            return this.NotFound();
        }

        return post;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Create(Post newPost)
    {
        // check if no content
        if (newPost.Content.Length == 0)
        {
            return this.NoContent();
        }

        // create the post
        if (await this._postsService.CreateAsync(newPost))
        {
            return this.Accepted(new { id = newPost.Id });
        }

        return this.Conflict();
    }

    [HttpPost("like")]
    public async Task<IActionResult> Like(Post likedPost)
    {
        // get current user
        int userId = this.GetCurrentUserId();

        if (userId <= 0)
        {
            return this.Conflict();
        }

        // set up the relationship
        bool result = await this._postsService.LikeAsync(userId, likedPost);

        if (!result)
        {
            return this.NotFound();
        }

        return this.Accepted();
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update(Post modifiedPost)
    {
        Post? thePost = await this._postsService.GetAsync(modifiedPost.Id);

        // if post is not found
        if (thePost is null)
        {
            return this.Conflict("PostNotFound");
        }

        // if user is trying to edit someone else's post
        if (thePost.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict("ConflictPostAuthorId");
        }

        // check if no content
        if (modifiedPost.Content.Length == 0)
        {
            return this.NoContent();
        }

        // update content
        thePost.Content = modifiedPost.Content;

        await this._postsService.SaveChangesAsync();

        return this.Accepted();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Remove(int id)
    {
        Post? thePost = await this._postsService.GetAsync(id);

        // if post is not found
        if (thePost is null)
        {
            return this.Conflict("PostNotFound");
        }

        // if user is trying to delete someone else's post
        if (thePost.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict("ConflictPostAuthorId");
        }

        // remove post
        await this._postsService.RemoveAsync(thePost);

        return this.Accepted();
    }
}