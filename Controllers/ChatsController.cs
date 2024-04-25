using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatsController(DatabaseContext db) : AbstractUserController
{
    private readonly ChatsService _chatsService = new(db);


    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<Chat>> Get(int id)
    {
        Chat? chat = await this._chatsService.GetAsync(id);

        if (chat is null)
        {
            return this.NotFound();
        }

        return chat;
    }

    [HttpGet("get/list")]
    public async Task<List<Chat>> GetUserAll()
    {
        return await this._chatsService.GetListAsync(this.GetCurrentUserId());
    }

    [HttpPost("new")]
    public async Task<IActionResult> Create(Chat newChat)
    {
        // ensure chat's owner is current user & you are not starting new chat with yourself
        if (newChat.Owner.Id != this.GetCurrentUserId() || newChat.Owner.Id == newChat.Target.Id)
        {
            return this.Conflict();
        }

        bool result = await this._chatsService.CreateAsync(newChat);

        if (result)
        {
            return this.Accepted();
        }

        return this.Conflict();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Remove(int id)
    {
        // get the chat to remove
        Chat? theChat = await this._chatsService.GetAsync(id);

        if (theChat is null)
        {
            return this.NotFound();
        }

        // ensure the Chat is owned by current user
        if (theChat.Owner.Id != this.GetCurrentUserId())
        {
            return this.Conflict();
        }

        await this._chatsService.RemoveAsync(theChat);

        return this.Ok();
    }
}