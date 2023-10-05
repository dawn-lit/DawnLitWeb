using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DawnLitWeb.Modules;
using Microsoft.AspNetCore.Mvc;

namespace DawnLitWeb.Controllers;

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