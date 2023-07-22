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
  UserData: User = {} as User;

  constructor(
    private _httpService: HttpService,
    private _router: Router
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

  logOff(): void {
    this._router.navigate(['/logoff']).then(() => {
      this.UserData = {} as User;
    });
  }
}
