using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatsController : AbstractUserController
{
    private readonly ChatsService _chatsService;

    public ChatsController(DatabaseContext db)
    {
        this._chatsService = new ChatsService(db);
    }


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

    [HttpPost("new")]
    public async Task<IActionResult> NewChat(Chat newChat)
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
    public async Task<IActionResult> RemoveChat(int id)
    {
        // get the chat to remove
        Chat? theChat = await this._chatsService.GetAsync(id);

        if (theChat is null)
        {
            return this.NotFound();
        }

        // ensure the Chat is own by current user
        if (theChat.Owner.Id != this.GetCurrentUserId())
        {
            return this.Conflict();
        }

        await this._chatsService.RemoveAsync(theChat);

        return this.Ok();
    }
}