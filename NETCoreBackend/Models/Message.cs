using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Message : AbstractModel
{
    [Display(Name = "author")]
    public User? Author { get; set; }

    [Display(Name = "content")]
    public string Content { get; set; } = string.Empty;
}