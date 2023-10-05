using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public class BlogComment : Discussion
{
    [Display(Name = "blog")]
    public Blog? Blog { get; set; }
}