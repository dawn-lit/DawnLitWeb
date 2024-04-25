using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public class PostCommentsService(DatabaseContext db) : AbstractService<PostComment>(db, db.PostComments)
{
    public new async Task<bool> CreateAsync(PostComment newPostComment)
    {
        // find references
        User? authorRef = await this.GetDatabaseContext().Users
            .FirstOrDefaultAsync(x => x.Id == newPostComment.Author!.Id);

        if (authorRef == null)
        {
            return false;
        }

        Post? postRef = await this.GetDatabaseContext().Posts.FirstOrDefaultAsync(x => x.Id == newPostComment.Post!.Id);
        if (postRef == null)
        {
            return false;
        }

        // attach reference
        newPostComment.Author = authorRef;
        newPostComment.Post = postRef;

        // setup one-to-many relationships
        authorRef.PostComments.Add(newPostComment);
        postRef.Comments.Add(newPostComment);

        return await base.CreateAsync(newPostComment);
    }

    public new async Task<PostComment?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<bool> LikeAsync(int likeByUserId, PostComment likedPostComment)
    {
        // find the user who like the post
        User? likeByUser = await this.GetDatabaseContext().Users.FirstOrDefaultAsync(x => x.Id == likeByUserId);

        if (likeByUser is null)
        {
            return false;
        }

        // find the true post comment
        PostComment? trueLikedComment = await this.GetDatabaseContext().PostComments
            .Include(p => p.LikedBy)
            .FirstOrDefaultAsync(p => p.Id == likedPostComment.Id);

        if (trueLikedComment is null)
        {
            return false;
        }

        if (trueLikedComment.LikedBy.Contains(likeByUser))
        {
            // remove relationship if exists
            trueLikedComment.LikedBy.Remove(likeByUser);
        }
        else
        {
            // setup relationships
            trueLikedComment.LikedBy.Add(likeByUser);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }
}