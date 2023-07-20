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

    public DbSet<PostField> PostFields { get; set; } = null!;

    public DbSet<Comment> Comments { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }
}