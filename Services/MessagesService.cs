using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public class MessagesService(DatabaseContext db) : AbstractService<Message>(db, db.Messages)
{
    private readonly ChatsService _chatsService = new(db);

    public new async Task<bool> CreateAsync(Message newMessage)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        // find sender reference
        User? authorRef = await dbContext.Users.FirstOrDefaultAsync(x => x.Id == newMessage.Sender.Id);
        if (authorRef == null)
        {
            return false;
        }

        newMessage.Sender = authorRef;

        // find chat reference
        Chat? chatRef = await dbContext.Chats
            .Include(c => c.Target)
            .ThenInclude(u => u.Chats)
            .ThenInclude(c => c.Target)
            .Include(c => c.Owner)
            .FirstOrDefaultAsync(x => x.Id == newMessage.Chat.Id);

        if (chatRef == null)
        {
            return false;
        }

        newMessage.Chat = chatRef;

        // add message to self chat
        await base.CreateAsync(newMessage);

        await this._chatsService.CreateAsync(
            new Chat
            {
                Owner = newMessage.Chat.Target,
                Target = newMessage.Chat.Owner
            }
        );

        // get the newest copy of target user data
        authorRef = await dbContext.Users
            .Include(u => u.Chats)
            .ThenInclude(c => c.Target)
            .FirstOrDefaultAsync(x => x.Id == newMessage.Chat.Target.Id);

        if (authorRef == null)
        {
            return false;
        }

        // add message to target chat
        await base.CreateAsync(
            new Message
            {
                Chat = authorRef.Chats.First(x => x.Target.Id == newMessage.Chat.Owner.Id),
                Sender = newMessage.Sender,
                Content = newMessage.Content
            }
        );

        return true;
    }
}