using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class ChatsService : AbstractService<Chat>
{
    public ChatsService(DatabaseContext db) : base(db, db.Chats)
    {
    }

    public new async Task<Chat?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(c => c.Owner)
            .Include(c => c.Target)
            .Include(c => c.Messages)
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Chat>> GetListAsync(int userId)
    {
        return await this.GetDatabaseCollection()
            .Include(c => c.Owner)
            .Include(c => c.Target)
            .Include(c => c.Messages)
            .ThenInclude(m => m.Sender)
            .OrderByDescending(c => c.CreatedAt)
            .Where(x => x.Owner.Id == userId)
            .ToListAsync();
    }

    public new async Task<bool> CreateAsync(Chat newChat)
    {
        // try find owner reference
        User? ownerUserRef = await this.GetDatabaseContext().Users
            .Include(u => u.Chats)
            .ThenInclude(c => c.Target)
            .FirstOrDefaultAsync(x => x.Id == newChat.Owner.Id);

        if (ownerUserRef == null)
        {
            return false;
        }

        // try find existing chat
        Chat? existsChat = ownerUserRef.Chats.FirstOrDefault(r => r.Target.Id == newChat.Target.Id);

        // is a chat already exists, then just update the time
        if (existsChat != null)
        {
            existsChat.UpdatedAt = DateTime.UtcNow;
            await this.SaveChangesAsync();
            return true;
        }

        // setup ownership
        newChat.Owner = ownerUserRef;

        // find target user reference
        User? targetUserRef = await this.GetDatabaseContext().Users.FirstOrDefaultAsync(x => x.Id == newChat.Target.Id);

        if (targetUserRef == null)
        {
            return false;
        }

        newChat.Target = targetUserRef;

        return await base.CreateAsync(newChat);
    }
}