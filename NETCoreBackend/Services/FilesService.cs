using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class FilesService : AbstractService<FileItem>
{
    public FilesService(DatabaseContext db) : base(db, db.Files)
    {
    }
}