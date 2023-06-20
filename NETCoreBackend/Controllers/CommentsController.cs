using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentsController : ControllerBase
{
    private readonly CommentsService _commentsService;

    public CommentsController(DatabaseContext db)
    {
        this._commentsService = new CommentsService(db);
    }

    [HttpGet("get/all")]
    public async Task<List<Comment>> Get()
    {
        return await this._commentsService.GetAsync();
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<Comment>> Get(int id)
    {
        Comment? comment = await this._commentsService.GetAsync(id);

        if (comment is null)
        {
            return this.NotFound();
        }

        return comment;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(Comment newComment)
    {
        // create the post
        if (await this._commentsService.CreateAsync(newComment))
        {
            return this.Accepted(new { id = newComment.Id });
        }

        return this.Conflict();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._commentsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}