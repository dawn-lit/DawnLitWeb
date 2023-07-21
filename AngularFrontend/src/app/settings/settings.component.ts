import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from "../http.service";
import { UserUpdateValidation } from "../utility.validations";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  UserData: User = {} as User;
  PasswordsTypes: Record<string, string> = {
    "cp": "password",
    "np": "password",
    "np2": "password",
  };
  PasswordData: Record<string, string> = {
    "password": "", "newPassword": "", "passwordConfirm": ""
  };
  ErrorMessage: Record<string, string> = {
    "name": "", "signature": "", "password": "", "newPassword": "", "passwordConfirm": ""
  };
  DeleteAccountConfirmed: boolean = false;

  constructor(
    private _httpService: HttpService
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.UserData = data as User;
      }
    });
  }

  togglePasswordVisibility(k: string) {
    this.PasswordsTypes[k] = this.PasswordsTypes[k] == "password" ? "text" : "password";
  }

  saveChanges(): void {
    const errors: Map<string, string> = UserUpdateValidation.checkInfo(this.UserData);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.ErrorMessage[key] = value;
      });
    } else {
      this._httpService.updateCurrentUserInfo(this.UserData).subscribe(data => {
        console.log(data);
      });
    }
  }

  updatePassword(): void {
    const errors: Map<string, string> = UserUpdateValidation.checkPassword(this.PasswordData);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.ErrorMessage[key] = value;
      });
    } else {
      this._httpService.updateCurrentUserPassword(this.PasswordData).subscribe((data: any) => {
        for (const key in this.PasswordData) {
          this.PasswordData[key] = "";
        }
      });
    }
  }

  deleteUser() {
    this._httpService.deleteUser().subscribe((data: any) => {
      console.log(data);
      this._httpService.logoffUser().subscribe(() => this._httpService.gotoHomePage());
    });
  }
}
