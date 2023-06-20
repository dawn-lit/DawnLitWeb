using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
    }

    public async Task<User?> GetWithConfidential(string email)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Confidential)
            .FirstOrDefaultAsync(x => x.Email == email);
    }
}