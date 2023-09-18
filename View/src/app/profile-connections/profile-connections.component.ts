import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from "../http.service";

@Component({
  selector: 'app-profile-connections',
  templateUrl: './profile-connections.component.html',
  styleUrls: ['./profile-connections.component.css']
})
export class ProfileConnectionsComponent {
  @Input() friends: Array<User> = [];
  @Input() enableButtons: boolean = false;
  @Output() childEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private _httpService: HttpService,
  ) {
  }

  removeFriend(user: User) {
    this._httpService.removeFriend(user).subscribe(() => {
      // make parent update friend list
      this.childEvent.emit();
    });
  }
}
