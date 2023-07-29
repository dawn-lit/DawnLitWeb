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
  userData: User = {} as User;
  passwordsTypes: Record<string, string> = {
    "cp": "password",
    "np": "password",
    "np2": "password",
  };
  passwordData: Record<string, string> = {
    "password": "", "newPassword": "", "passwordConfirm": ""
  };
  errorMessage: Record<string, string> = {
    "name": "", "signature": "", "about": "", "password": "", "newPassword": "", "passwordConfirm": ""
  };
  deleteAccountConfirmed: boolean = false;

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
        this.userData = data as User;
      }
    });
  }

  togglePasswordVisibility(k: string) {
    this.passwordsTypes[k] = this.passwordsTypes[k] == "password" ? "text" : "password";
  }

  saveChanges(): void {
    const errors: Map<string, string> = UserUpdateValidation.checkInfo(this.userData);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.errorMessage[key] = value;
      });
    } else {
      this._httpService.updateCurrentUserInfo(this.userData).subscribe(data => {
        console.log(data);
      });
    }
  }

  updatePassword(): void {
    const errors: Map<string, string> = UserUpdateValidation.checkPassword(this.passwordData);
    if (errors.size > 0) {
      errors.forEach((value: string, key: string) => {
        this.errorMessage[key] = value;
      });
    } else {
      this._httpService.updateCurrentUserPassword(this.passwordData).subscribe((data: any) => {
        for (const key in this.passwordData) {
          this.passwordData[key] = "";
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
