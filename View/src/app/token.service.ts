import { JwtHelperService } from "@auth0/angular-jwt";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
    private _jwtHelper: JwtHelperService,
  ) {
  }

  public set(token: string) {
    localStorage.setItem("jwt_token", token);
  }

  public get(): string | null {
    const token = localStorage.getItem("jwt_token");
    if (token == null || this._jwtHelper.isTokenExpired(token)) {
      return null;
    } else {
      return token;
    }
  }

  public isStillValid(): boolean {
    return this.get() != null;
  }
}
