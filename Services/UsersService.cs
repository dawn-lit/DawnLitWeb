using DawnLitWeb.Models;
using DawnLitWeb.Modules;
using Microsoft.EntityFrameworkCore;

namespace DawnLitWeb.Services;

public class UsersService : AbstractService<User>
{
    private const int MAX_USERS = 10;
    private readonly ConfidentialService _confidentialService;
    private readonly RequestsService _requestsService;

    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
        this._confidentialService = new ConfidentialService(db);
        this._requestsService = new RequestsService(db);
    }

    public new async Task<bool> CreateAsync(User newUser)
    {
        // hashing the password
        Authentications.CreatePasswordHash(newUser.Password, out byte[] passwordHash, out byte[] passwordSalt);

        // create an associate confidential record
        newUser.Confidential = new Confidential
        {
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            LoginIp = newUser.LoginIp,
            RegisterIp = newUser.LoginIp
        };

        return await base.CreateAsync(newUser);
    }

    public async Task<bool> ChangePasswordAsync(User theUser, string newPassword)
    {
        // hashing the new password
        Authentications.CreatePasswordHash(newPassword, out byte[] passwordHash, out byte[] passwordSalt);

        theUser.Confidential!.PasswordHash = passwordHash;
        theUser.Confidential!.PasswordSalt = passwordSalt;

        // save the changes
        await this._confidentialService.SaveChangesAsync();

        return true;
    }

    public new async Task<User?> GetAsync(int id)
    {
        return await this.GetDatabaseCollection()
            .Include(x => x.Posts)
            .Include(x => x.Requests)
            .ThenInclude(x => x.Sender)
            .Include(x => x.Friends)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<User>> GetListAsync(int currentUserId, int num)
    {
        return await this.GetDatabaseCollection()
            .Where(x => x.Id != currentUserId)
            .Include(x => x.Friends)
            .Include(x => x.Requests)
            .ThenInclude(x => x.Sender)
            .OrderByDescending(o => o.CreatedAt)
            .Take(Math.Min(num, MAX_USERS))
            .ToListAsync();
    }

    public async Task<User?> GetAsync(string email, bool withConfidential)
    {
        if (!withConfidential)
        {
            return await this.GetDatabaseCollection()
                .FirstOrDefaultAsync(x => x.Email == email);
        }

        return await this.GetDatabaseCollection()
            .Include(m => m.Confidential)
            .FirstOrDefaultAsync(x => x.Email == email);
    }

    public async Task AttachConfidentialAsync(User theUser)
    {
        theUser.Confidential = await this._confidentialService.GetAsync(theUser);
    }

    public async Task<bool> SendFriendRequest(User currentUser, User targetUser)
    {
        // if current user is already a friend of target user, then do nothing
        if (targetUser.Friends.Contains(currentUser))
        {
            return false;
        }

        Request? existsCurrentUserRequest =
            targetUser.Requests.FirstOrDefault(r => r.Sender == currentUser && r.Type == "FRIEND_REQUEST");

        if (existsCurrentUserRequest != null)
        {
            // remove request if exists
            targetUser.Requests.Remove(existsCurrentUserRequest);
        }
        else
        {
            // create friend request
            Request newRequest = new()
            {
                Receiver = targetUser,
                Sender = currentUser,
                Type = "FRIEND_REQUEST"
            };

            await this._requestsService.CreateAsync(newRequest);

            // send the request
            targetUser.Requests.Add(newRequest);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task<bool> AcceptFriendRequest(User currentUser, User targetUser)
    {
        // if target user is already a friend of current user, then do nothing
        if (currentUser.Friends.Contains(targetUser))
        {
            return false;
        }

        // find the request
        Request? existsCurrentUserRequest =
            currentUser.Requests.FirstOrDefault(r => r.Sender == targetUser && r.Type == "FRIEND_REQUEST");

        // if target user has not even send a friend request to current user yet, then do nothing
        if (existsCurrentUserRequest == null)
        {
            return false;
        }

        // now current user have target user as friend
        currentUser.Requests.Remove(existsCurrentUserRequest);
        currentUser.Friends.Add(targetUser);
        targetUser.Friends.Add(currentUser);

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RejectFriendRequest(User currentUser, User targetUser)
    {
        // if target user is already a friend of current user, then do nothing
        if (currentUser.Friends.Contains(targetUser))
        {
            return false;
        }

        // find the request
        Request? existsCurrentUserRequest =
            currentUser.Requests.FirstOrDefault(r => r.Sender == targetUser && r.Type == "FRIEND_REQUEST");

        // if target user has not even send a friend request to current user yet, then do nothing
        if (existsCurrentUserRequest == null)
        {
            return false;
        }

        // current user remove target user from all existing requests
        currentUser.Requests.Remove(existsCurrentUserRequest);

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task RemoveFriend(User currentUser, User targetUser)
    {
        if (currentUser.Friends.Contains(targetUser))
        {
            currentUser.Friends.Remove(targetUser);
        }

        if (targetUser.Friends.Contains(currentUser))
        {
            targetUser.Friends.Remove(currentUser);
        }

        // save the changes
        await this.SaveChangesAsync();
    }
}