using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatsController : ControllerBase
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
}