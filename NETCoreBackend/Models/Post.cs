using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Post : Message
{
    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; } = new List<Comment>();

    [Display(Name = "likedBy")]
    public ICollection<User> LikedBy { get; } = new List<User>();
}