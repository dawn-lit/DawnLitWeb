using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Medal : AbstractModel
{
    [Required]
    [Display(Name = "name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Display(Name = "description")]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Display(Name = "requirement")]
    public string Requirement { get; set; } = string.Empty;
}