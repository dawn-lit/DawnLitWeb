using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostFieldsService : AbstractService<PostField>
{
    public PostFieldsService(DatabaseContext db) : base(db, db.PostFields)
    {
    }
}