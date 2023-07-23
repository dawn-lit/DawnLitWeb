using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Comment : AbstractModel
{
    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Display(Name = "replies")]
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();

    [Display(Name = "author")]
    public User? Author { get; set; }

    [Display(Name = "post")]
    public Post? Post { get; set; }
}