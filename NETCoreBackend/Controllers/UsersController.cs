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

        // ensure the Date is not in the future
        if (newUser.Birthday.CompareTo(DateTime.Today) > 0)
        {
            return this.Conflict("Birthday");
        }

        newUser.Birthday = DateTime.SpecifyKind(newUser.Birthday, DateTimeKind.Utc);

        // hashing the password
        Authentications.CreatePasswordHash(newUser.Password, out byte[] passwordHash, out byte[] passwordSalt);
        newUser.Confidential.PasswordHash = passwordHash;
        newUser.Confidential.PasswordSalt = passwordSalt;

        // set Login Ip as Register Ip
        newUser.LoginIp = newUser.RegisterIp;

        // create the user
        await this._usersService.CreateAsync(newUser);

        return this.Accepted(new { token = Authentications.CreateJwtToken(newUser) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User userThatLogin)
    {
        User? theUserData = await this._usersService.GetWithConfidential(userThatLogin.Email);

        // ensure that the user exists
        if (theUserData == null)
        {
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the password is correct
        if (!Authentications.VerifyPasswordHash(userThatLogin.Password, theUserData.Confidential))
        {
            return this.Ok(new { accepted = false, password = "password_incorrect" });
        }

        theUserData.UpdatedAt = DateTime.UtcNow;

        await this._usersService.SaveChangesAsync();

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(theUserData) });
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