using DawnLitWeb.Models;
using DawnLitWeb.Modules;

namespace DawnLitWeb.Services;

public class RequestsService : AbstractService<Request>
{
    public RequestsService(DatabaseContext db) : base(db, db.Requests)
    {
    }
}