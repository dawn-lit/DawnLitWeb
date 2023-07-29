import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { LoginValidation } from "../utility.validations";
import { TokenService } from "../token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  LoginData: Record<string, string> = {"email": "", "password": "", "captcha": "", "loginIp": ""};
  ErrorMessage: Record<string, string> = {"email": "", "password": "", "captcha": ""};
  isBlocked: boolean = false;

  constructor(
    private _httpService: HttpService,
    private _http: HttpClient,
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
    this._httpService.getIpInfo().subscribe((res: any) => {
      this.resetErrorMessage();

      this.LoginData["loginIp"] = res.ip;
      const errors: Map<string, string> = LoginValidation.check(this.LoginData);

      if (errors.size > 0) {
        errors.forEach((value: string, key: string) => {
          this.ErrorMessage[key] = value;
        });
      } else {
        this._httpService.loginUser(this.LoginData).subscribe({
          next: (data: any) => {
            if (data.accepted == true) {
              this._token.set(data.token);
              this._httpService.gotoHomePage();
              this.resetLoginData();
            } else {
              Object.entries(data).forEach(
                ([key, value]) => this.ErrorMessage[key] = LoginValidation.getMessage(value as string)
              );
            }
          },
          error: (e) => console.log(e),
          complete: () => console.info('complete')
        });
      }
    });
  }

  resetLoginData(): void {
    for (const key in this.LoginData) {
      this.LoginData[key] = "";
    }
  }

  resetErrorMessage(): void {
    for (const key in this.ErrorMessage) {
      this.ErrorMessage[key] = "";
    }
  }
}
