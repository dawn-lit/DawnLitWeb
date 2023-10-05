using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

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
    public async Task<IActionResult> Create(Message newMessages)
    {
        // create the post
        if (await this._messagesService.CreateAsync(newMessages))
        {
            return this.Accepted(new { id = newMessages.Id });
        }

        return this.Conflict();
    }
}