using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

//板块
public class PostField : AbstractModel
{
    [Required]
    [Display(Name = "name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Display(Name = "image")]
    public string Image { get; set; } = string.Empty;

    [Required]
    [Display(Name = "permission")]
    public int Permission { get; set; } = 0;
}