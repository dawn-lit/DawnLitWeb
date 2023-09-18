using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class BlogComment : Discussion
{
    [Display(Name = "blog")]
    public Blog? Blog { get; set; }
}