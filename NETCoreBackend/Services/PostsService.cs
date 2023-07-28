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

    public async Task<List<Post>> GetListAsync(int num)
    {
        if (num > MAX_POSTS)
        {
            num = MAX_POSTS;
        }

        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.Comments)
            .ThenInclude(m => m.LikedBy)
            .Include(m => m.LikedBy)
            .Take(num)
            .ToListAsync();
    }

    public async Task<Post?> GetLatestAsync()
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.Comments)
            .FirstOrDefaultAsync();
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