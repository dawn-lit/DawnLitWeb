using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Comment : Message
{
    [Display(Name = "post")]
    public Post? Post { get; set; }

    [Display(Name = "likedBy")]
    public ICollection<User> LikedBy { get; } = new List<User>();

    [Display(Name = "replies")]
    public ICollection<Comment> Replies { get; } = new List<Comment>();
}