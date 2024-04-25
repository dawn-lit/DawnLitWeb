using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public class FilesService(DatabaseContext db) : AbstractService<FileItem>(db, db.Files)
{
    public async Task<FileItem?> GetAsync(int useId, string fileType)
    {
        return await this.GetDatabaseCollection()
            .FirstOrDefaultAsync(x => x.Creator.Id == useId && x.Type.Equals(fileType));
    }
}