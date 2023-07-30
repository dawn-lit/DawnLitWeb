import { Component, Input } from '@angular/core';
import { User } from "../utility.models";

@Component({
  selector: 'app-profile-connections',
  templateUrl: './profile-connections.component.html',
  styleUrls: ['./profile-connections.component.css']
})
export class ProfileConnectionsComponent {
  @Input() friends: Array<User> = [];
  @Input() enableButtons: boolean = false;
}
