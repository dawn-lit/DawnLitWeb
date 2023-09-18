import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { LoginValidation } from "../utility.validations";
import { TokenService } from "../token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData: Record<string, string> = {"email": "", "password": "", "captcha": "", "loginIp": ""};
  errorMessage: Record<string, string> = {"email": "", "password": "", "captcha": ""};
  isBlocked: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _token: TokenService
  ) {
  }

  ngOnInit(): void {
    this._httpService.ensureNotLoginAlready();
    this.isBlocked = false;
  }

  onSubmit(): void {
    if (this.isBlocked) {
      return;
    }
    this.isBlocked = true;
    this._httpService.getIpInfo().subscribe(res => {
      // set ip
      this.loginData["loginIp"] = res.ip;
      // update error message
      this.resetErrorMessage();
      const errors: Map<string, string> = LoginValidation.check(this.loginData);
      // if there is errors
      if (errors.size > 0) {
        errors.forEach((value: string, key: string) => {
          this.errorMessage[key] = value;
        });
        this.isBlocked = false;
      } else {
        this._httpService.loginUser(this.loginData).subscribe((data: any) => {
          if (data.accepted == true) {
            this._token.set(data.token);
            this._httpService.gotoHomePage();
            this.resetLoginData();
          } else {
            Object.entries(data).forEach(
              ([key, value]) => this.errorMessage[key] = LoginValidation.getMessage(value as string)
            );
          }
          this.isBlocked = false;
        });
      }
    });
  }

  resetLoginData(): void {
    for (const key in this.loginData) {
      this.loginData[key] = "";
    }
  }

  resetErrorMessage(): void {
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
  }
}
