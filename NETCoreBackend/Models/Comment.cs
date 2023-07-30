using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Comment : Discussion
{
    [Display(Name = "post")]
    public Post? Post { get; set; }

    [Display(Name = "replies")]
    public ICollection<Comment> Replies { get; } = new List<Comment>();
}