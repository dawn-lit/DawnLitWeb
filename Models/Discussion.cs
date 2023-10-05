using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public abstract class Discussion : AbstractModel
{
    [Display(Name = "author")]
    public User? Author { get; set; }

    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Display(Name = "likedBy")]
    public ICollection<User> LikedBy { get; } = new List<User>();
}