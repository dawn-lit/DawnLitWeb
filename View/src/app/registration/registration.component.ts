import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { RegistrationValidation } from "../utility.validations";
import { TokenService } from "../token.service";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  registrationData: Record<string, string> = {
    "name": "", "email": "", "password": "", "password_confirm": "", "captcha": "", "loginIp": "",
  };
  errorMessage: Record<string, string> = {
    "name": "", "email": "", "password": "", "password_confirm": "", "captcha": ""
  };
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
    // reset error message
    for (const key in this.errorMessage) {
      this.errorMessage[key] = "";
    }
    // get the registration ip first
    this._httpService.getIpInfo().subscribe(res => {
      this.registrationData['loginIp'] = res.ip;
      if (this.registrationData['loginIp'] != null && this.registrationData['loginIp'] != "") {
        // update error message
        const errors: Map<string, string> = RegistrationValidation.check(this.registrationData);
        // if there is errors
        if (errors.size > 0) {
          errors.forEach((value: string, key: string) => {
            this.errorMessage[key] = value;
          });
          this.isBlocked = false;
        } else {
          this._httpService.registerUser(this.registrationData).subscribe((data: any) => {
            if (data.accepted == true) {
              this._token.set(data.token);
              this._httpService.gotoHomePage();
              // reset registration ngmodel
              for (const key in this.registrationData) {
                this.registrationData[key] = "";
              }
            } else {
              Object.entries(data).forEach(
                ([key, value]) => this.errorMessage[key] = RegistrationValidation.getMessage(value as string)
              );
            }
            this.isBlocked = false;
          });
        }
      }
    });
  }
}
