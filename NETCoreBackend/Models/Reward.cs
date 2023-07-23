using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Reward : AbstractModel
{
    [Required]
    [Display(Name = "type")]
    public int Type { get; set; } = 0;

    [Required]
    [Display(Name = "amount")]
    public int Amount { get; set; } = 0;

    [Required]
    [Display(Name = "givenBy")]
    public string GivenBy { get; set; } = string.Empty;
}