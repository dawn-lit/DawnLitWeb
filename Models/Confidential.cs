using System.ComponentModel.DataAnnotations;

namespace DawnLitWeb.Models;

public class Confidential : AbstractModel
{
    [Required]
    public string RegisterIp { get; set; } = string.Empty;

    [Required]
    public string LoginIp { get; set; } = string.Empty;

    [Required]
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();

    [Required]
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();

    public int UserId { get; set; }

    public User User { get; set; } = null!;
}