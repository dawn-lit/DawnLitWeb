using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Chat : AbstractModel
{
    [Display(Name = "owner")]
    public User Owner { get; set; } = null!;

    [Display(Name = "target")]
    public User Target { get; set; } = null!;

    [Display(Name = "messages")]
    public ICollection<Message> Messages { get; set; } = new List<Message>();
}