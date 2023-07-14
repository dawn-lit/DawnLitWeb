using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
    }

    public async Task<User?> GetAsync(string email)
    {
        return await this.GetDatabaseCollection()
            .FirstOrDefaultAsync(x => x.Email == email);
    }
}