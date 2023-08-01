using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using NETCoreBackend.Modules;

namespace NETCoreBackend.Controllers;

public abstract class AbstractUserController : ControllerBase
{
    protected int GetCurrentUserId()
    {
        JwtSecurityToken? theToken = Authentications.ReadJwtToken(this.Request);
        if (theToken == null)
        {
            return 0;
        }

        string theSId = theToken.Claims
            .First(claim => claim.Type == ClaimTypes.PrimarySid).Value;

        return int.TryParse(theSId, out int theId) ? theId : 0;
    }
}