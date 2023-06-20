using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

//帖子
public class Post : AbstractModel
{
    [Required]
    [Display(Name = "field")]
    public PostField Field { get; set; } = null!;

    [Required]
    [Display(Name = "title")]
    [MaxLength(80)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [Display(Name = "author")]
    public User Author { get; set; } = null!;

    [Required]
    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [Required]
    [Display(Name = "permission")]
    public int Permission { get; set; } = 0;
}