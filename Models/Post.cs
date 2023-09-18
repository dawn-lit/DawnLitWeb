using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Post : Discussion
{
    [Display(Name = "comments")]
    public ICollection<PostComment> Comments { get; } = new List<PostComment>();
}