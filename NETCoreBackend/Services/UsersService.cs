using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
    }

    public async Task<User?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(x => x.Posts)
            .Include(x => x.Comments)
            .Include(x => x.LikedPosts)
            .Include(x => x.LikedComments)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<User?> GetAsync(string email, bool withConfidential)
    {
        if (!withConfidential)
        {
            return await this.GetDatabaseCollection()
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        return await this.GetDatabaseCollection()
            .Include(m => m.Confidential)
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task<bool> LikePostAsync(User likeByUser, Post likedPost)
    {
        // find the true post
        Post? trueLikedPost = await this.GetDatabaseContext().Posts.FindAsync(likedPost.Id);

        if (trueLikedPost is null)
        {
            return false;
        }

        if (likeByUser.LikedPosts.Contains(trueLikedPost))
        {
            // remove relationship if exists
            likeByUser.LikedPosts.Remove(trueLikedPost);
        }
        else
        {
            // setup relationships
            likeByUser.LikedPosts.Add(trueLikedPost);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LikeCommentAsync(User likeByUser, Comment likedComment)
    {
        // find the true post
        Comment? trueLikedComment = await this.GetDatabaseContext().Comments.FindAsync(likedComment.Id);

        if (trueLikedComment is null)
        {
            return false;
        }

        if (likeByUser.LikedComments.Contains(trueLikedComment))
        {
            // remove relationship if exists
            likeByUser.LikedComments.Remove(trueLikedComment);
        }
        else
        {
            // setup relationships
            likeByUser.LikedComments.Add(trueLikedComment);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }
}