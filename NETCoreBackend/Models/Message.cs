using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Message : AbstractModel
{
    [Required]
    [Display(Name = "title")]
    public string Title { get; set; } = string.Empty;

    [Required]
    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;

    [Required]
    [Display(Name = "sender")]
    public User Sender { get; set; }

    [Required]
    [Display(Name = "receiver")]
    public User Receiver { get; set; }
}