using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public abstract class AbstractModel
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Display(Name = "createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Required]
    [Display(Name = "updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}