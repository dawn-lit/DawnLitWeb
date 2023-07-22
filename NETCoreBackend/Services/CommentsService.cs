using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class CommentsService : AbstractService<Comment>
{
    public CommentsService(DatabaseContext db) : base(db, db.Comments)
    {
    }

    public new async Task<bool> CreateAsync(Comment newComment)
    {
        // find references
        User? authorRef = await this.GetDatabaseContext().Users.FirstOrDefaultAsync(x => x.Id == newComment.Author.Id);
        if (authorRef == null)
        {
            return false;
        }

        Post? postRef = await this.GetDatabaseContext().Posts.FirstOrDefaultAsync(x => x.Id == newComment.Post.Id);
        if (postRef == null)
        {
            return false;
        }

        // attach reference
        newComment.Author = authorRef;
        newComment.Post = postRef;

        // setup one to many relationships
        authorRef.Comments.Add(newComment);
        postRef.Comments.Add(newComment);

        return await base.CreateAsync(newComment);
    }
}