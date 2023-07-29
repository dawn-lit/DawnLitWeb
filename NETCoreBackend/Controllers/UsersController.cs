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
    private const int MAX_SIGNATURE_LENGTH = 500;

    private const int MIN_ABOUT_LENGTH = 0;
    private const int MAX_ABOUT_LENGTH = 500;

    private readonly ConfidentialService _confidentialService;

    private readonly UsersService _usersService;

    public UsersController(DatabaseContext db)
    {
        this._usersService = new UsersService(db);
        this._confidentialService = new ConfidentialService(db);
    }

    private int GetCurrentUserId()
    {
        string theSId = Authentications.ReadJwtToken(this.Request).Claims
            .First(claim => claim.Type == ClaimTypes.PrimarySid).Value;

        return !int.TryParse(theSId, out int theId) ? 0 : theId;
    }

    private async Task<User?> GetCurrentUser()
    {
        int theId = this.GetCurrentUserId();

        if (theId > 0)
        {
            return await this._usersService.GetAsync(theId);
        }

        return null;
    }

    [HttpGet("current")]
    public async Task<ActionResult<User>> GetCurrent()
    {
        User? user = await this.GetCurrentUser();

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

        // create an associate confidential record
        Confidential userConfidential = new()
        {
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };

        await this._confidentialService.CreateAsync(userConfidential);

        // update user confidential
        newUser.Confidential = userConfidential;
        newUser.Confidential.LoginIp = newUser.LoginIp;
        newUser.Confidential.RegisterIp = newUser.LoginIp;

        // create the user
        await this._usersService.CreateAsync(newUser);

        return this.Accepted(new { token = Authentications.CreateJwtToken(newUser) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User userThatLogin)
    {
        User? theUserData = await this._usersService.GetAsync(userThatLogin.Email, true);

        // ensure that the user exists
        if (theUserData == null)
        {
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the password is correct
        if (!Authentications.VerifyPasswordHash(userThatLogin.Password, theUserData.Confidential!))
        {
            return this.Ok(new { accepted = false, password = "password_incorrect" });
        }

        theUserData.UpdatedAt = DateTime.UtcNow;
        theUserData.Confidential!.LoginIp = userThatLogin.LoginIp;

        await this._usersService.SaveChangesAsync();

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(theUserData) });
    }

    [HttpPut("update/info")]
    public async Task<IActionResult> UpdateInfo(User modifiedUser)
    {
        // ensure the user name length is within range
        if (modifiedUser.Name.Length is < MIN_NAME_LENGTH or > MAX_NAME_LENGTH)
        {
            return this.Conflict("Name");
        }

        // ensure the signature length is within range
        if (modifiedUser.Signature.Length is < MIN_SIGNATURE_LENGTH or > MAX_SIGNATURE_LENGTH)
        {
            return this.Conflict("Signature");
        }

        // ensure the signature length is within range
        if (modifiedUser.About.Length is < MIN_ABOUT_LENGTH or > MAX_ABOUT_LENGTH)
        {
            return this.Conflict("About");
        }

        // get current user
        User? user = await this.GetCurrentUser();

        if (user is null)
        {
            return this.NotFound();
        }

        // modify user information
        user.Name = modifiedUser.Name;
        user.Signature = modifiedUser.Signature;
        user.About = modifiedUser.About;

        // save the changes
        await this._usersService.SaveChangesAsync();

        return this.Accepted();
    }


    [HttpPut("update/password")]
    public async Task<IActionResult> UpdatePassword(User modifiedUser)
    {
        // ensure the password length is within range
        if (modifiedUser.Password.Length is < MIN_PASSWORD_LENGTH or > MAX_PASSWORD_LENGTH)
        {
            return this.Conflict("Password");
        }

        // get current user
        User? user = await this.GetCurrentUser();

        if (user is null)
        {
            return this.NotFound();
        }

        // make sure that the password is correct
        if (!Authentications.VerifyPasswordHash(modifiedUser.Password, user.Confidential!))
        {
            return this.Conflict(new { accepted = false, password = "password_incorrect" });
        }

        // hashing the new password
        Authentications.CreatePasswordHash(modifiedUser.NewPassword, out byte[] passwordHash, out byte[] passwordSalt);

        user.Confidential!.PasswordHash = passwordHash;
        user.Confidential!.PasswordSalt = passwordSalt;

        // save the changes
        await this._confidentialService.SaveChangesAsync();

        return this.Accepted();
    }

    [HttpPost("like/post")]
    public async Task<IActionResult> LikePost(Post likedPost)
    {
        // get current user
        User? user = await this.GetCurrentUser();

        if (user is null)
        {
            return this.NotFound();
        }

        // set up the relationship
        bool result = await this._usersService.LikePostAsync(user, likedPost);

        if (!result)
        {
            return this.NotFound();
        }

        return this.Accepted();
    }

    [HttpPost("like/comment")]
    public async Task<IActionResult> LikeComment(Comment likedComment)
    {
        // get current user
        User? user = await this.GetCurrentUser();

        if (user is null)
        {
            return this.NotFound();
        }

        // set up the relationship
        bool result = await this._usersService.LikeCommentAsync(user, likedComment);

        if (!result)
        {
            return this.NotFound();
        }

        return this.Accepted();
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Delete()
    {
        // get current user id
        int theId = this.GetCurrentUserId();

        if (theId == 0)
        {
            return this.NotFound();
        }

        bool result = await this._usersService.RemoveAsync(theId);

        if (result)
        {
            return this.Accepted();
        }

        return this.NotFound();
    }
}