using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;

namespace NETCoreBackend.Modules;

public class DatabaseContext : DbContext
{
    public DatabaseContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Confidential> Confidential { get; set; } = null!;

    public DbSet<Post> Posts { get; set; } = null!;

    public DbSet<Comment> Comments { get; set; } = null!;

    public DbSet<Request> Requests { get; set; } = null!;

    public DbSet<Chat> Chats { get; set; } = null!;

    public DbSet<Message> Messages { get; set; } = null!;

    public DbSet<FileItem> Files { get; set; } = null!;

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
            .HasMany(e => e.Comments)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Files)
            .WithOne(e => e.Creator);

        modelBuilder.Entity<Post>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.Post);

        modelBuilder.Entity<Chat>()
            .HasMany(e => e.Messages)
            .WithOne(e => e.Chat);

        modelBuilder.UseSerialColumns();
    }
}