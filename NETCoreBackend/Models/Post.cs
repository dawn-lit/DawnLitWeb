using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Post : Discussion
{
    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; } = new List<Comment>();
}