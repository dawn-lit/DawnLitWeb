using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class ConfidentialService : AbstractService<Confidential>
{
    public ConfidentialService(DatabaseContext db) : base(db, db.Confidential)
    {
    }
}