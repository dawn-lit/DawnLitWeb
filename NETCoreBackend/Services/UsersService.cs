using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
    }

    public async Task<User?> GetAsync(int id, bool withConfidential)
    {
        if (!withConfidential)
        {
            return await this.GetAsync(id);
        }

        return await this.GetDatabaseCollection().Include(m => m.Confidential).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User?> GetAsync(string email, bool withConfidential)
    {
        if (!withConfidential)
        {
            return await this.GetDatabaseCollection()
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        return await this.GetDatabaseCollection()
            .Include(m => m.Confidential)
            .FirstOrDefaultAsync(x => x.Email == email);
    }
}