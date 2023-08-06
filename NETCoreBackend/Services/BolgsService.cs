using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class BlogsService : AbstractService<Blog>
{
    private const int MAX_BLOGS = 100;

    public BlogsService(DatabaseContext db) : base(db, db.Blogs)
    {
    }

    public new async Task<bool> CreateAsync(Blog newBlog)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        // setup relationships
        EntityEntry<User> authorRef = dbContext.Users.Attach(newBlog.Author!);
        authorRef.Entity.Blogs.Add(newBlog);

        return await base.CreateAsync(newBlog);
    }

    public async Task<List<Blog>> GetListAsync(int userId)
    {
        return await this.GetDatabaseCollection()
            .Where(x => x.Author!.Id == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Blog>> GetListAsync(int userId, int num)
    {
        return await this.GetDatabaseCollection()
            .Where(x => x.Author!.Id == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Take(Math.Min(num, MAX_BLOGS))
            .ToListAsync();
    }
}