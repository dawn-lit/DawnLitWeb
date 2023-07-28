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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .HasMany(e => e.Posts)
            .WithOne(e => e.Author);

        modelBuilder.Entity<User>()
            .HasMany(e => e.LikedPosts)
            .WithMany(e => e.LikedBy);

        modelBuilder.Entity<User>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.Author);

        modelBuilder.Entity<Post>()
            .HasMany(e => e.Comments)
            .WithOne(e => e.Post);

        modelBuilder.UseSerialColumns();
    }
}