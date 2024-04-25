using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogsController(DatabaseContext db) : AbstractUserController
{
    private readonly BlogsService _blogsService = new(db);


    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<Blog>> Get(int id)
    {
        Blog? blog = await this._blogsService.GetAsync(id);

        if (blog is null)
        {
            return this.NotFound();
        }

        return blog;
    }

    [HttpGet("get/list")]
    public async Task<List<Blog>> GetUserAll()
    {
        return await this._blogsService.GetListAsync(this.GetCurrentUserId());
    }

    [HttpGet("get/announcements/{num:int}")]
    public async Task<List<Blog>> GetAnnouncements(int num)
    {
        return await this._blogsService.GetListAsync(1, num);
    }

    [HttpPost("new")]
    public async Task<IActionResult> Create(Blog newBlog)
    {
        // check if empty title or content
        if (newBlog.Title.Length == 0 || newBlog.Content.Length == 0)
        {
            return this.NoContent();
        }

        // ensure blog's owner is current user & you are not starting new blog with yourself
        if (newBlog.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict();
        }

        bool result = await this._blogsService.CreateAsync(newBlog);

        if (result)
        {
            return this.Accepted(new { id = newBlog.Id });
        }

        return this.Conflict();
    }

    [HttpPut("update")]
    public async Task<IActionResult> Update(Blog modifiedBlog)
    {
        // check if empty title or content
        if (modifiedBlog.Title.Length == 0 || modifiedBlog.Content.Length == 0)
        {
            return this.NoContent();
        }

        Blog? theBlog = await this._blogsService.GetAsync(modifiedBlog.Id);

        // if blog is not found
        if (theBlog is null)
        {
            return this.Conflict("BlogNotFound");
        }

        // if user is trying to edit someone else's Blog
        if (theBlog.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict("ConflictBlogAuthorId");
        }

        // update content
        theBlog.Title = modifiedBlog.Title;
        theBlog.Content = modifiedBlog.Content;

        await this._blogsService.SaveChangesAsync();

        return this.Accepted();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Remove(int id)
    {
        Blog? theBlog = await this._blogsService.GetAsync(id);

        // if blog is not found
        if (theBlog is null)
        {
            return this.Conflict("BlogNotFound");
        }

        // if user is trying to delete someone else's blog
        if (theBlog.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict("ConflictBlogAuthorId");
        }

        // remove blog
        await this._blogsService.RemoveAsync(theBlog);

        return this.Accepted();
    }
}