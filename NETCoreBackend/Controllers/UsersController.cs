using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;
using NETCoreBackend.Services;

namespace NETCoreBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private const int MIN_NAME_LENGTH = 2;
    private const int MAX_NAME_LENGTH = 16;

    private const int MIN_PASSWORD_LENGTH = 8;
    private const int MAX_PASSWORD_LENGTH = 16;

    private const int MIN_SIGNATURE_LENGTH = 0;
    private const int MAX_SIGNATURE_LENGTH = 300;

    private readonly UsersService _usersService;

    public UsersController(DatabaseContext db)
    {
        this._usersService = new UsersService(db);
    }

    [HttpGet("current")]
    public async Task<ActionResult<User>> GetCurrent()
    {
        string theSId = Authentications.ReadJwtToken(this.Request).Claims
            .First(claim => claim.Type == ClaimTypes.PrimarySid).Value;

        if (!int.TryParse(theSId, out int theId))
        {
            return this.NotFound();
        }

        User? user = await this._usersService.GetAsync(theId);

        if (user is not null)
        {
            return user;
        }

        return this.NotFound();
    }

    [HttpGet("get/{id:int}")]
    public async Task<ActionResult<User>> Get(int id)
    {
        User? user = await this._usersService.GetAsync(id);

        if (user is null)
        {
            return this.NotFound();
        }

        return user;
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(User newUser)
    {
        // ensure the email is not empty and valid
        if (newUser.Email.Length <= 0 || !new EmailAddressAttribute().IsValid(newUser.Email))
        {
            return this.Conflict("Email");
        }

        // ensure the user name length is within range
        if (newUser.Name.Length is < MIN_NAME_LENGTH or > MAX_NAME_LENGTH)
        {
            return this.Conflict("Name");
        }

        // ensure the password length is within range
        if (newUser.Password.Length is < MIN_PASSWORD_LENGTH or > MAX_PASSWORD_LENGTH)
        {
            return this.Conflict("Password");
        }

        // hashing the password
        Authentications.CreatePasswordHash(newUser.Password, out byte[] passwordHash, out byte[] passwordSalt);
        newUser.PasswordHash = passwordHash;
        newUser.PasswordSalt = passwordSalt;

        // set Login Ip as Register Ip
        newUser.LoginIp = newUser.RegisterIp;

        // create the user
        await this._usersService.CreateAsync(newUser);

        return this.Accepted(new { token = Authentications.CreateJwtToken(newUser) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User userThatLogin)
    {
        User? theUserData = await this._usersService.GetAsync(userThatLogin.Email);

        // ensure that the user exists
        if (theUserData == null)
        {
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the password is correct
        if (!Authentications.VerifyPasswordHash(userThatLogin.Password, theUserData.PasswordHash,
                theUserData.PasswordSalt))
        {
            return this.Ok(new { accepted = false, password = "password_incorrect" });
        }

        theUserData.UpdatedAt = DateTime.UtcNow;

        await this._usersService.SaveChangesAsync();

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(theUserData) });
    }

    [HttpPut("update/current/info")]
    public async Task<IActionResult> PutInfo(User modifiedUser)
    {
        // ensure the email is not empty and valid
        if (modifiedUser.Email.Length <= 0 || !new EmailAddressAttribute().IsValid(modifiedUser.Email))
        {
            return this.Conflict("Email");
        }

        // ensure the user name length is within range
        if (modifiedUser.Name.Length is < MIN_NAME_LENGTH or > MAX_NAME_LENGTH)
        {
            return this.Conflict("Name");
        }

        // get current user
        string theSId = Authentications.ReadJwtToken(this.Request).Claims
            .First(claim => claim.Type == ClaimTypes.PrimarySid).Value;

        if (!int.TryParse(theSId, out int theId))
        {
            return this.NotFound();
        }

        User? user = await this._usersService.GetAsync(theId);

        if (user is null)
        {
            return this.NotFound();
        }

        // modify user information
        user.Name = modifiedUser.Name;
        user.Signature = modifiedUser.Signature;

        // save the changes
        await this._usersService.SaveChangesAsync();

        return this.Accepted();
    }

    [HttpDelete("delete/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool result = await this._usersService.RemoveAsync(id);

        if (result)
        {
            return this.NoContent();
        }

        return this.NotFound();
    }
}