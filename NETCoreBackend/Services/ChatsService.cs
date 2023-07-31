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
            .Include(c => c.Target)
            .Include(c => c.Owner)
            .Include(c => c.Messages)
            .ThenInclude(m => m.Sender)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}