import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from '../http.service';
import { Router } from "@angular/router";
import { getExistenceTime } from "../utility.functions";
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
    // set the theme
    this.setTheme('theme' in localStorage ? localStorage['theme'] : this.getPreferredTheme());
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

  getPreferredTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme: string) {
    localStorage.setItem('theme', theme);
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  }
}
