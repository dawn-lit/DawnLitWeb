using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public class FileItem : AbstractModel
{
    [Display(Name = "creator")]
    public User Creator { get; set; } = null!;

    [Display(Name = "type")]
    public string Type { get; set; } = string.Empty;

    [Display(Name = "name")]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "path")]
    public string Path { get; set; } = string.Empty;

    [Display(Name = "size")]
    public double Size { get; set; }
}