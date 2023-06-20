using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

// 帖子的回复
public class Comment : AbstractModel
{
    [Required]
    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [Display(Name = "author")]
    public User Author { get; set; } = null!;

    [Required]
    [Display(Name = "field")]
    public PostField Field { get; set; } = null!;

    [Required]
    [Display(Name = "post")]
    public Post Post { get; set; } = null!;
}