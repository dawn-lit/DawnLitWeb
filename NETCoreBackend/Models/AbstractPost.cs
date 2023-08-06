using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public abstract class AbstractPost : Discussion
{
    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; } = new List<Comment>();
}