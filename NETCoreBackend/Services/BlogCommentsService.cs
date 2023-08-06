using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class BlogCommentsService : AbstractService<BlogComment>
{
    public BlogCommentsService(DatabaseContext db) : base(db, db.BlogComments)
    {
    }

    public new async Task<bool> CreateAsync(BlogComment newBlogComment)
    {
        // find references
        User? authorRef = await this.GetDatabaseContext().Users
            .FirstOrDefaultAsync(x => x.Id == newBlogComment.Author!.Id);

        if (authorRef == null)
        {
            return false;
        }

        Blog? blogRef = await this.GetDatabaseContext().Blogs.FirstOrDefaultAsync(x => x.Id == newBlogComment.Blog!.Id);
        if (blogRef == null)
        {
            return false;
        }

        // attach reference
        newBlogComment.Author = authorRef;
        newBlogComment.Blog = blogRef;

        // setup one to many relationships
        authorRef.BlogComments.Add(newBlogComment);
        blogRef.Comments.Add(newBlogComment);

        return await base.CreateAsync(newBlogComment);
    }

    public new async Task<BlogComment?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(m => m.Author)
            .Include(m => m.LikedBy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }
}