using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NETCoreBackend.Models;

public class User : AbstractModel
{
    [Display(Name = "name")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [Display(Name = "email")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Display(Name = "birthday")]
    public DateTime Birthday { get; set; }

    [Required]
    [Display(Name = "group")]
    public int Group { get; set; } = 0;

    [Required]
    [Display(Name = "posts")]
    public ICollection<Post> Posts { get; set; } = new List<Post>();

    [Required]
    [Display(Name = "comments")]
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();

    [Display(Name = "registerIp")]
    public string RegisterIp { get; set; } = string.Empty;

    [Display(Name = "loginIp")]
    public string LoginIp { get; set; } = string.Empty;

    [Required]
    [Display(Name = "friends")]
    public ICollection<User> Friends { get; set; } = new List<User>();

    [Required]
    [Display(Name = "credits")]
    public int Credits { get; set; } = 0;

    [Required]
    [Display(Name = "money")]
    public int Money { get; set; } = 0;

    [Required]
    [Display(Name = "exp")]
    public int Exp { get; set; } = 0;

    [Display(Name = "signature")]
    public string Signature { get; set; } = string.Empty;

    [Display(Name = "avatar")]
    public string Avatar { get; set; } = string.Empty;

    [Display(Name = "banned")]
    public bool Banned { get; set; } = false;

    [NotMapped]
    [Display(Name = "password")]
    public string Password { get; set; } = string.Empty;

    public Confidential Confidential { get; set; } = null!;
}