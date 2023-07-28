import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from '../http.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  userData: User = {} as User;

  constructor(
    private _httpService: HttpService,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this.getUserData();
    this.initTheme();
  }

  getUserData(): void {
    this._httpService.getCurrentUser().subscribe(data => {
      if (data != null && Object.keys(data).length > 0) {
        this.userData = data as User;
      }
    });
  }

  logOff(): void {
    this._router.navigate(['/logoff']).then(() => {
      this.userData = {} as User;
    });
  }

  initTheme(): void {
    // init and set the theme
    this.setTheme('theme' in localStorage ? localStorage['theme'] : this.getPreferredTheme());
    // add the listener to detect theme changes
    window.addEventListener('DOMContentLoaded', () => {
      if (document.querySelector('.theme-icon-active') != undefined) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
          if (localStorage.getItem('theme') == undefined || "auto") {
            this.setTheme(this.getPreferredTheme());
          }
        });
        document.querySelectorAll('[data-bs-theme-value]')
          .forEach(toggle => {
            toggle.addEventListener('click', () => {
              const theme = toggle.getAttribute('data-bs-theme-value');
              if (theme != undefined) {
                localStorage.setItem('theme', theme);
                this.setTheme(theme);
              }
            });
          });
      }
    });
  }

  getPreferredTheme(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  setTheme(theme: string) {
    if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme);
    }
  }
}
