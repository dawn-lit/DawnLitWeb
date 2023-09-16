using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;

namespace NETCoreBackend.Modules;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Blog> Blogs { get; set; } = null!;

    public DbSet<Chat> Chats { get; set; } = null!;

    public DbSet<PostComment> PostComments { get; set; } = null!;

    public DbSet<BlogComment> BlogComments { get; set; } = null!;

    public DbSet<Confidential> Confidential { get; set; } = null!;

    public DbSet<FileItem> Files { get; set; } = null!;

    public DbSet<Message> Messages { get; set; } = null!;

    public DbSet<Post> Posts { get; set; } = null!;

    public DbSet<Request> Requests { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(e => e.Requests)
            .WithOne(e => e.Receiver);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Chats)
            .WithOne(e => e.Owner);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Posts)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.LikedPosts)
            .WithMany(e => e.LikedBy);

        modelBuilder.Entity<User>()
            .HasMany(e => e.PostComments)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.LikedPostComments)
            .WithMany(e => e.LikedBy);

        modelBuilder.Entity<User>()
            .HasMany(e => e.BlogComments)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.LikedBlogComments)
            .WithMany(e => e.LikedBy);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Blogs)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.LikedBlogs)
            .WithMany(e => e.LikedBy);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Files)
            .WithOne(e => e.Creator);

        modelBuilder.Entity<User>()
            .HasOne(e => e.Confidential)
            .WithOne(e => e.User)
            .HasForeignKey<Confidential>(e => e.UserId)
            .IsRequired();

        modelBuilder.Entity<Post>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.Post);

        modelBuilder.Entity<Blog>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.Blog);

        modelBuilder.Entity<Chat>()
            .HasMany(e => e.Messages)
            .WithOne(e => e.Chat);

        modelBuilder.UseSerialColumns();
    }
}