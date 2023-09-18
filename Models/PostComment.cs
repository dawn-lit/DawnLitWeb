using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class PostComment : Discussion
{
    [Display(Name = "post")]
    public Post? Post { get; set; }
}