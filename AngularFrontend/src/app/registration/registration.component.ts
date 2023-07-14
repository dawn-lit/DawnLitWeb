import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationValidation } from "../utility.validations";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  RegistrationData: Record<string, string> = {
    "name": "", "email": "", "password": "", "password_confirm": "", "captcha": "", "registerIp": "",
  };
  ErrorMessage: Record<string, string> = {
    "name": "", "email": "", "password": "", "password_confirm": "", "captcha": ""
  };

  constructor(
    private _httpService: HttpService,
    private _http: HttpClient,
  ) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    // reset error message
    for (const key in this.ErrorMessage) {
      this.ErrorMessage[key] = "";
    }
    // get the registration ip first
    this._httpService.getIpInfo().subscribe((res: any) => {
      this.RegistrationData['registerIp'] = res.ip;
      if (this.RegistrationData['registerIp'] != null && this.RegistrationData['registerIp'] != "") {
        const errors: Map<string, string> = RegistrationValidation.check(this.RegistrationData);
        if (errors.size > 0) {
          errors.forEach((value: string, key: string) => {
            this.ErrorMessage[key] = value;
            console.log(this.ErrorMessage);
          });
        } else {
          console.log(this.RegistrationData);
          this._httpService.registerUser(this.RegistrationData).subscribe((data: any) => {
            this._httpService.gotoHomePage();
            // reset registration ngmodel
            for (const key in this.RegistrationData) {
              this.RegistrationData[key] = "";
            }
          });
        }
      }
    });
  }
}
