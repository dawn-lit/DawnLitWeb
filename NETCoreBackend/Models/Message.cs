using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Message : AbstractModel
{
    [Display(Name = "chat")]
    public Chat Chat { get; set; } = null!;

    [Display(Name = "sender")]
    public User Sender { get; set; } = null!;

    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;
}