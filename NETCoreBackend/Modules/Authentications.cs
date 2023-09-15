using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using NETCoreBackend.Models;

namespace NETCoreBackend.Modules;

public static class Authentications
{
    public static readonly string TOKEN = ConfigurationManager.AppSetting["JwtIssuerSigningKey"];

    public static string CreateJwtToken(User theUser)
    {
        List<Claim> claims = new()
        {
            new Claim(ClaimTypes.Name, theUser.Name),
            new Claim(ClaimTypes.PrimarySid, theUser.Id.ToString()),
            new Claim(ClaimTypes.Email, theUser.Email)
        };

        SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(TOKEN));

        SigningCredentials cred = new(key, SecurityAlgorithms.HmacSha512Signature);

        JwtSecurityToken token = new(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: cred);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static JwtSecurityToken? ReadJwtToken(HttpRequest theRequest)
    {
        string theTokenString = theRequest.Headers[HeaderNames.Authorization].ToString().Replace("Bearer ", "");
        return theTokenString.Equals(string.Empty) ? null : new JwtSecurityTokenHandler().ReadJwtToken(theTokenString);
    }

    public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using HMACSHA512 hmac = new();
        passwordSalt = hmac.Key;
        passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
    }

    public static bool VerifyPasswordHash(string password, Confidential confidential)
    {
        using HMACSHA512 hmac = new(confidential.PasswordSalt);
        byte[] computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return computeHash.SequenceEqual(confidential.PasswordHash);
    }
}