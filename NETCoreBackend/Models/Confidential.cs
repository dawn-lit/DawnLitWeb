using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Confidential : AbstractModel
{
    [Required]
    [Display(Name = "passwordHash")]
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

    [Required]
    [Display(Name = "passwordSalt")]
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
}