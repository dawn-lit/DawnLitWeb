using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class ConfidentialService : AbstractService<Confidential>
{
    public ConfidentialService(DatabaseContext db) : base(db, db.Confidential)
    {
    }

    public async Task<Confidential?> GetAsync(User theUser)
    {
        return await this.GetDatabaseCollection()
            .FirstOrDefaultAsync(x => x.UserId == theUser.Id);
    }
}