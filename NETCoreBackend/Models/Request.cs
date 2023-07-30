using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Request : AbstractModel
{
    [Display(Name = "sender")]
    public User Sender { get; set; }

    [Display(Name = "receiver")]
    public User Receiver { get; set; }

    [Display(Name = "type")]
    public string Type { get; set; }
}