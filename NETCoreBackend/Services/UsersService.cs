using Microsoft.EntityFrameworkCore;
using NETCoreBackend.Models;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Services;

public class UsersService : AbstractService<User>
{
    private const int MAX_USERS = 10;
    private readonly ChatsService _chatsService;
    private readonly ConfidentialService _confidentialService;
    private readonly RequestsService _requestsService;

    public UsersService(DatabaseContext db) : base(db, db.Users)
    {
        this._confidentialService = new ConfidentialService(db);
        this._requestsService = new RequestsService(db);
        this._chatsService = new ChatsService(db);
    }

    public new async Task<bool> CreateAsync(User newUser)
    {
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
            .Include(x => x.Comments)
            .Include(x => x.LikedPosts)
            .Include(x => x.LikedComments)
            .Include(x => x.Requests)
            .ThenInclude(x => x.Sender)
            .Include(x => x.Friends)
            .Include(x => x.Chats.OrderByDescending(o => o.CreatedAt))
            .ThenInclude(c => c.Target)
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

    public async Task<bool> LikePostAsync(User likeByUser, Post likedPost)
    {
        // find the true post
        Post? trueLikedPost = await this.GetDatabaseContext().Posts.FindAsync(likedPost.Id);

        if (trueLikedPost is null)
        {
            return false;
        }

        if (likeByUser.LikedPosts.Contains(trueLikedPost))
        {
            // remove relationship if exists
            likeByUser.LikedPosts.Remove(trueLikedPost);
        }
        else
        {
            // setup relationships
            likeByUser.LikedPosts.Add(trueLikedPost);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task<bool> LikeCommentAsync(User likeByUser, Comment likedComment)
    {
        // find the true post
        Comment? trueLikedComment = await this.GetDatabaseContext().Comments.FindAsync(likedComment.Id);

        if (trueLikedComment is null)
        {
            return false;
        }

        if (likeByUser.LikedComments.Contains(trueLikedComment))
        {
            // remove relationship if exists
            likeByUser.LikedComments.Remove(trueLikedComment);
        }
        else
        {
            // setup relationships
            likeByUser.LikedComments.Add(trueLikedComment);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
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

    public async Task<bool> NewChat(User currentUser, User targetUser)
    {
        // try find existing chat
        Chat? existsChat = currentUser.Chats.FirstOrDefault(r => r.Target.Id == targetUser.Id);

        if (existsChat != null)
        {
            existsChat.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            // create new chat
            Chat newChat = new()
            {
                Owner = currentUser,
                Target = targetUser
            };

            await this._chatsService.CreateAsync(newChat);

            // add chat
            currentUser.Chats.Add(newChat);
        }

        // save the changes
        await this.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveChat(User currentUser, User targetUser)
    {
        // try find existing chat
        Chat? existsChat = currentUser.Chats.FirstOrDefault(r => r.Target == targetUser);

        if (existsChat == null)
        {
            return false;
        }

        // remove chat
        currentUser.Chats.Remove(existsChat);

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