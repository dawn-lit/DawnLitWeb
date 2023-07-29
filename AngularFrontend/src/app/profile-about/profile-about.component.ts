import { Component, Input } from '@angular/core';
import { User } from "../utility.models";

@Component({
  selector: 'app-profile-about',
  templateUrl: './profile-about.component.html',
  styleUrls: ['./profile-about.component.css']
})
export class ProfileAboutComponent {
  @Input() userData: User = {} as User;
}
