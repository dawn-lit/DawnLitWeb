import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from '../http.service';
import { Router } from "@angular/router";
import { DarkModeService } from "angular-dark-mode";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  UserData: User = {} as User;

  constructor(
    private _httpService: HttpService,
    private _router: Router,
    protected _darkModeService: DarkModeService
  ) {
  }

  ngOnInit(): void {
    this._darkModeService.disable();
    this.getUserData();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.UserData = data as User;
      }
    });
  }

  logOff(): void {
    this._router.navigate(['/logoff']).then(() => {
      this.UserData = {} as User;
    });
  }
}
