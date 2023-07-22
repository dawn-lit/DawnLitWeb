using System.ComponentModel.DataAnnotations;

namespace NETCoreBackend.Models;

public class Confidential : AbstractModel
{
    [Required]
    [Display(Name = "registerIp")]
    public string RegisterIp { get; set; } = string.Empty;

    [Required]
    [Display(Name = "loginIp")]
    public string LoginIp { get; set; } = string.Empty;

    [Required]
    [Display(Name = "passwordHash")]
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

    [Required]
    [Display(Name = "passwordSalt")]
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
}