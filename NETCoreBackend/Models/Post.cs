using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Post : AbstractModel
{
    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Display(Name = "author")]
    public User? Author { get; set; }

    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [Display(Name = "likedBy")]
    public ICollection<User> LikedBy { get; set; } = new List<User>();

    [Display(Name = "permission")]
    public int Permission { get; set; } = 0;
}