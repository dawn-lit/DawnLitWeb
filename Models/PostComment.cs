using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public class PostComment : Discussion
{
    [Display(Name = "post")]
    public Post? Post { get; set; }
}