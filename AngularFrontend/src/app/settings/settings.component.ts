import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from "../http.service";

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

  onSubmit(): void {
    this._httpService.updateCurrentUserInfo(this.UserData).subscribe(data => {
      console.log(data);
    });
  }
}
