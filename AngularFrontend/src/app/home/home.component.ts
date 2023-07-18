import { Component } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from "../http.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
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
}
