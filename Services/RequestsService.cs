using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class RequestsService : AbstractService<Request>
{
    public RequestsService(DatabaseContext db) : base(db, db.Requests)
    {
    }
}