using DawnLitWeb.Models;
using DawnLitWeb.Modules;

namespace DawnLitWeb.Services;

public class RequestsService(DatabaseContext db) : AbstractService<Request>(db, db.Requests);