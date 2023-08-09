import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from '../http.service';
import { Router } from "@angular/router";
import { getExistenceTime, Theme } from "../utility.functions";
import { map } from "rxjs";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  userData: User | null = null;
  protected readonly getExistenceTime = getExistenceTime;

  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    // apply the theme
    Theme.apply();
    // get current user data
    this.getUserData();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().pipe(map(data => this.userData = data)).subscribe();
  }

  logOff(): void {
    this._router.navigate(['/logoff']).then(() => {
      this.userData = null;
    });
  }

  acceptFriendRequest(reqFrom: User) {
    this._httpService.acceptFriendRequest(reqFrom).subscribe(() => {
      this.getUserData();
    });
  }

  rejectFriendRequest(reqFrom: User) {
    this._httpService.rejectFriendRequest(reqFrom).subscribe(() => {
      this.getUserData();
    });
  }

  setTheme(theme: string) {
    Theme.set(theme);
  }
}
