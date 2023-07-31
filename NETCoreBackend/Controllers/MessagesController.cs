using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessagesController : ControllerBase
{
    private readonly MessagesService _messagesService;

    public MessagesController(DatabaseContext db)
    {
        this._messagesService = new MessagesService(db);
    }


    [HttpPost("new")]
    public async Task<IActionResult> Post(Message newMessages)
    {
        // create the post
        if (await this._messagesService.CreateAsync(newMessages))
        {
            return this.Accepted(new { id = newMessages.Id });
        }

        return this.Conflict();
    }
}