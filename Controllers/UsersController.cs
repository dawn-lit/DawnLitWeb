using System.ComponentModel.DataAnnotations;
using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using DawnLitWeb.Services;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(DatabaseContext db) : AbstractUserController
{
    private const int MIN_NAME_LENGTH = 2;
    private const int MAX_NAME_LENGTH = 16;

    private const int MIN_PASSWORD_LENGTH = 8;
    private const int MAX_PASSWORD_LENGTH = 16;

    private const int MIN_SIGNATURE_LENGTH = 0;
    private const int MAX_SIGNATURE_LENGTH = 100;

    private const int MIN_ABOUT_LENGTH = 0;
    private const int MAX_ABOUT_LENGTH = 500;

    private readonly UsersService _usersService = new(db);

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

    [HttpGet("get/list/{num:int}")]
    public async Task<List<User>> GetList(int num)
    {
        return await this._usersService.GetListAsync(this.GetCurrentUserId(), num);
    }

    [HttpPost("new")]
    public async Task<IActionResult> Post(User newUser)
    {
        // ensure the email is not empty and valid
        if (newUser.Email.Length <= 0 || !new EmailAddressAttribute().IsValid(newUser.Email))
        {
            return this.Conflict("Email");
        }

        // ensure the username length is within range
        if (newUser.Name.Length is < MIN_NAME_LENGTH or > MAX_NAME_LENGTH)
        {
            return this.Conflict("Name");
        }

        // ensure the password length is within range
        if (newUser.Password.Length is < MIN_PASSWORD_LENGTH or > MAX_PASSWORD_LENGTH)
        {
            return this.Conflict("Password");
        }

        // ensure the email is not used yet
        User? theUser = await this._usersService.GetAsync(newUser.Email, false);
        if (theUser != null)
        {
            // if the user already exists or is still waiting for deletion
            if (theUser.DeletedAt == null || DateTime.UtcNow < theUser.DeletedAt)
            {
                return this.Ok(new { accepted = false, email = "already_exist" });
            }

            // if the user is supposed to be deleted
            await this._usersService.RemoveAsync(theUser);
        }

        // create the user
        await this._usersService.CreateAsync(newUser);

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(newUser) });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(User userThatLogin)
    {
        User? theUser = await this._usersService.GetAsync(userThatLogin.Email, true);

        // ensure the user exists
        if (theUser == null)
        {
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the user is in deletion
        if (theUser.DeletedAt != null)
        {
            // if the user is still waiting to be deleted
            if (DateTime.UtcNow < theUser.DeletedAt)
            {
                return this.Ok(new { accepted = false, email = "account_being_deleted" });
            }

            // if the user is supposed to be deleted
            await this._usersService.RemoveAsync(theUser);
            return this.Ok(new { accepted = false, email = "email_cannot_find" });
        }

        // whether the password is correct
        if (!Authentications.VerifyPasswordHash(userThatLogin.Password, theUser.Confidential!))
        {
            return this.Ok(new { accepted = false, password = "password_incorrect" });
        }

        theUser.UpdatedAt = DateTime.UtcNow;
        theUser.Confidential!.LoginIp = userThatLogin.LoginIp;

        await this._usersService.SaveChangesAsync();

        return this.Accepted(new { accepted = true, token = Authentications.CreateJwtToken(theUser) });
    }

    [HttpPut("update/info")]
    public async Task<IActionResult> UpdateInfo(User modifiedUser)
    {
        // ensure the username length is within range
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
        user.Github = modifiedUser.Github;
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
        await this._usersService.AttachConfidentialAsync(user);

        if (!Authentications.VerifyPasswordHash(modifiedUser.Password, user.Confidential!))
        {
            return this.Conflict(new { accepted = false, password = "password_incorrect" });
        }

        // update the new password
        await this._usersService.ChangePasswordAsync(user, modifiedUser.NewPassword);

        return this.Accepted();
    }

    [HttpPost("connect/request")]
    public async Task<IActionResult> SendFriendRequest(User targetUser)
    {
        // get current user
        User? currentUser = await this.GetCurrentUser();

        if (currentUser is null)
        {
            return this.NotFound("current user");
        }

        // get target user
        targetUser = (await this._usersService.GetAsync(targetUser.Id))!;

        // ensure not the same user
        if (currentUser.Id == targetUser.Id)
        {
            return this.Conflict();
        }

        await this._usersService.SendFriendRequest(currentUser, targetUser);

        return this.Accepted();
    }

    [HttpPost("connect/accept")]
    public async Task<IActionResult> AcceptFriendRequest(User targetUser)
    {
        // get current user
        User? currentUser = await this.GetCurrentUser();

        if (currentUser is null)
        {
            return this.NotFound("current user");
        }

        // get target user
        targetUser = (await this._usersService.GetAsync(targetUser.Id))!;

        // ensure not the same user
        if (currentUser.Id == targetUser.Id)
        {
            return this.Conflict();
        }

        await this._usersService.AcceptFriendRequest(currentUser, targetUser);

        return this.Accepted();
    }

    [HttpPost("connect/reject")]
    public async Task<IActionResult> RejectFriendRequest(User targetUser)
    {
        // get current user
        User? currentUser = await this.GetCurrentUser();

        if (currentUser is null)
        {
            return this.NotFound("current user");
        }

        // get target user
        targetUser = (await this._usersService.GetAsync(targetUser.Id))!;

        // ensure not the same user
        if (currentUser.Id == targetUser.Id)
        {
            return this.Conflict();
        }

        await this._usersService.RejectFriendRequest(currentUser, targetUser);

        return this.Accepted();
    }

    [HttpPost("connect/remove")]
    public async Task<IActionResult> RemoveFriend(User targetUser)
    {
        // get current user
        User? currentUser = await this.GetCurrentUser();

        if (currentUser is null)
        {
            return this.NotFound("current user");
        }

        // get target user
        targetUser = (await this._usersService.GetAsync(targetUser.Id))!;

        // ensure not the same user
        if (currentUser.Id == targetUser.Id)
        {
            return this.Conflict();
        }

        await this._usersService.RemoveFriend(currentUser, targetUser);

        return this.Accepted();
    }

    [HttpDelete("delete")]
    public async Task<IActionResult> Remove()
    {
        // get current user
        User? currentUser = await this.GetCurrentUser();

        if (currentUser is null)
        {
            return this.NotFound("current user");
        }

        // only marked user as deleted (in 7 days)
        currentUser.DeletedAt ??= DateTime.UtcNow.AddDays(7);

        // save the changes
        await this._usersService.SaveChangesAsync();

        return this.Accepted();
    }
}