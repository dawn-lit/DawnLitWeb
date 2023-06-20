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

    public async Task<List<Post>> GetListAsync(int field, int num)
    {
        if (num > MAX_POSTS)
        {
            num = MAX_POSTS;
        }

        return await this.GetDatabaseCollection()
            .Where(x => x.Field.Id == field)
            .Include(m => m.Author)
            .Take(num)
            .ToListAsync();
    }

    public async Task<List<Post>> GetOfficialLatestAsync(int num)
    {
        if (num > MAX_POSTS)
        {
            num = MAX_POSTS;
        }

        return await this.GetDatabaseCollection()
            .Where(x => x.Field.Id <= 3)
            .OrderByDescending(p => p.Id)
            .Take(num).ToListAsync();
    }

    public async Task<Post?> GetLatestAsync(int field)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .FirstOrDefaultAsync(x => x.Field.Id == field);
    }

    public async Task<Post?> GetCompleteAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.Field)
            .Include(m => m.Comments)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public new async Task<bool> CreateAsync(Post newPost)
    {
        DatabaseContext dbContext = this.GetDatabaseContext();

        // setup relationships
        dbContext.PostFields.Attach(newPost.Field);
        EntityEntry<User> authorRef = dbContext.Users.Attach(newPost.Author);
        authorRef.Entity.Posts.Add(newPost);

        return await base.CreateAsync(newPost);
    }
}