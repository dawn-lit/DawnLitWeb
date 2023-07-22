using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly PostsService _postsService;

    public PostsController(DatabaseContext db)
    {
        this._postsService = new PostsService(db);
    }

    [HttpGet("count")]
    public async Task<ActionResult<long>> Count()
    {
        return await this._postsService.CountAsync();
    }

    [HttpGet("get/latest")]
    public async Task<ActionResult<Post>> GetLatest()
    {
        Post? post = await this._postsService.GetLatestAsync();

        if (post is null)
        {
            return this.NotFound();
        }

        return post;
    }

    [HttpGet("get/list/official/{num:int}")]
    public async Task<List<Post>> GetOfficialLatest(int num)
    {
        return await this._postsService.GetOfficialLatestAsync(num);
    }

    [HttpGet("get/list/{num:int}")]
    public async Task<List<Post>> GetList(int num)
    {
        return await this._postsService.GetListAsync(num);
    }

    [HttpGet("get/complete/{id:int}")]
    public async Task<ActionResult<Post>> GetComplete(int id)
    {
        Post? post = await this._postsService.GetCompleteAsync(id);

        if (post is null)
        {
            return this.NotFound();
        }

        return post;
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
    public async Task<IActionResult> Post(Post newPost)
    {
        // create the post
        if (await this._postsService.CreateAsync(newPost))
        {
            return this.Accepted(new { id = newPost.Id });
        }

        return this.Conflict();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._postsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}