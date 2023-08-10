using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogsController : AbstractUserController
{
    private readonly BlogsService _blogsService;

    public BlogsController(DatabaseContext db)
    {
        this._blogsService = new BlogsService(db);
    }


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
        // ensure blog's owner is current user & you are not starting new blog with yourself
        if (newBlog.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict();
        }

        bool result = await this._blogsService.CreateAsync(newBlog);

        if (result)
        {
            return this.Accepted();
        }

        return this.Conflict();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Remove(int id)
    {
        // get the blog to remove
        Blog? theBlog = await this._blogsService.GetAsync(id);

        if (theBlog is null)
        {
            return this.NotFound();
        }

        // ensure the Blog is own by current user
        if (theBlog.Author!.Id != this.GetCurrentUserId())
        {
            return this.Conflict();
        }

        await this._blogsService.RemoveAsync(theBlog);

        return this.Ok();
    }
}