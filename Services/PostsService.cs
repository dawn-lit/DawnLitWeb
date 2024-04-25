using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace DawnLitWeb.Services;

public class PostsService(DatabaseContext db) : AbstractService<Post>(db, db.Posts)
{
    private const int MAX_POSTS = 100;

    public new async Task<Post?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .Include(m => m.Comments)
            .ThenInclude(m => m.LikedBy)
            .Include(m => m.Comments.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(m => m.Author)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<Post>> GetListAsync(int num)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .Include(m => m.Comments)
            .ThenInclude(m => m.LikedBy)
            .Include(m => m.Comments.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(m => m.Author)
            .OrderByDescending(o => o.CreatedAt)
            .Take(Math.Min(num, MAX_POSTS))
            .ToListAsync();
    }

    public async Task<List<Post>> GetUserListAsync(int userId, int num)
    {
        return await this.GetDatabaseCollection()
            .Where(x => x.Author!.Id == userId)
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .Include(m => m.Comments)
            .ThenInclude(m => m.LikedBy)
            .Include(m => m.Comments.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(m => m.Author)
            .OrderByDescending(o => o.CreatedAt)
            .Take(Math.Min(num, MAX_POSTS))
            .ToListAsync();
    }

    public new async Task<bool> CreateAsync(Post newPost)
    {
        // setup relationships
        EntityEntry<User> authorRef = this.GetDatabaseContext().Users.Attach(newPost.Author!);
        authorRef.Entity.Posts.Add(newPost);

        return await base.CreateAsync(newPost);
    }

    public async Task<bool> LikeAsync(int likeByUserId, Post likedPost)
    {
        // find the user who like the post
        User? likeByUser = await this.GetDatabaseContext().Users.FirstOrDefaultAsync(x => x.Id == likeByUserId);

        if (likeByUser is null)
        {
            return false;
        }

        // find the post
        Post? trueLikedPost = await this.GetDatabaseCollection()
            .Include(p => p.LikedBy)
            .FirstOrDefaultAsync(p => p.Id == likedPost.Id);

        if (trueLikedPost is null)
        {
            return false;
        }

        // remove relationship if exists
        if (trueLikedPost.LikedBy.Contains(likeByUser))
        {
            trueLikedPost.LikedBy.Remove(likeByUser);
        }
        // setup relationships
        else
        {
            trueLikedPost.LikedBy.Add(likeByUser);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }
}