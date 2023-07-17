import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from '../http.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  UserData: User = {} as User;

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
        console.log(this.UserData);
      }
    });
  }

  logOff(): void {
    this._httpService.logoffUser();
    this.UserData = {} as User;
  }
}
