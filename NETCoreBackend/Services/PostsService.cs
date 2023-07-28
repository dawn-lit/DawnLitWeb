using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostsService : AbstractService<Post>
{
    private const int MAX_POSTS = 100;

    public PostsService(DatabaseContext db) : base(db, db.Posts)
    {
    }

    public new async Task<Post?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .Include(m => m.Comments.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(m => m.LikedBy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Post>> GetListAsync(int num)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .Include(m => m.Comments.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(m => m.LikedBy)
            .OrderByDescending(o => o.CreatedAt)
            .Take(Math.Min(num, MAX_POSTS))
            .ToListAsync();
    }

    public new async Task<bool> CreateAsync(Post newPost)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        // setup relationships
        EntityEntry<User> authorRef = dbContext.Users.Attach(newPost.Author!);
        authorRef.Entity.Posts.Add(newPost);

        return await base.CreateAsync(newPost);
    }
}