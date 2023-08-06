using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Blog : AbstractPost
{
    [Display(Name = "title")]
    public string Title { get; set; } = string.Empty;
}