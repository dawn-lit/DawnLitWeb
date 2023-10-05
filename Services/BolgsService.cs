using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DawnLitWeb.Services;

public class BlogsService : AbstractService<Blog>
{
    private const int MAX_BLOGS = 100;

    public BlogsService(DatabaseContext db) : base(db, db.Blogs)
    {
    }

    public new async Task<Blog?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(b => b.Author)
            .Include(b => b.Comments)
            .ThenInclude(c => c.Author)
            .Include(b => b.LikedBy)
            .FirstOrDefaultAsync(x => x.Id == id);
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