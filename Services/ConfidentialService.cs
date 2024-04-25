using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public class ConfidentialService(DatabaseContext db) : AbstractService<Confidential>(db, db.Confidential)
{
    public async Task<Confidential?> GetAsync(User theUser)
    {
        return await this.GetDatabaseCollection()
            .FirstOrDefaultAsync(x => x.UserId == theUser.Id);
    }
}