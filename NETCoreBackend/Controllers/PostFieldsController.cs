using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PostFieldsController : ControllerBase
{
    private readonly PostFieldsService _postFieldsService;

    public PostFieldsController(DatabaseContext db)
    {
        this._postFieldsService = new PostFieldsService(db);
    }

    [HttpGet("get/all")]
    public async Task<List<PostField>> Get()
    {
        return await this._postFieldsService.GetAsync();
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<PostField>> Get(int id)
    {
        PostField? postField = await this._postFieldsService.GetAsync(id);

        if (postField is null)
        {
            return this.NotFound();
        }

        return postField;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(PostField newPostField)
    {
        // create the user
        await this._postFieldsService.CreateAsync(newPostField);

        return this.Accepted();
    }

    [HttpPut("update/{id:int}")]
    public async Task<IActionResult> Update(int id, PostField updatedPostField)
    {
        PostField? postField = await this._postFieldsService.GetAsync(id);

        if (postField is null)
        {
            return this.NotFound();
        }

        updatedPostField.Name = postField.Name;

        await this._postFieldsService.SaveChangesAsync();

        return this.NoContent();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._postFieldsService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}