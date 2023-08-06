using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class PostCommentsService : AbstractService<PostComment>
{
    public PostCommentsService(DatabaseContext db) : base(db, db.PostComments)
    {
    }

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

        // setup one to many relationships
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
}