using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public class Blog : Discussion
{
    [Display(Name = "title")]
    public string Title { get; set; } = string.Empty;

    [Display(Name = "comments")]
    public ICollection<BlogComment> Comments { get; } = new List<BlogComment>();
}