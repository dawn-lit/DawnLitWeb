import { Component, Input } from '@angular/core';
import { User } from "../utility.models";
import { HttpService } from "../http.service";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css']
})
export class AvatarComponent {
  @Input() userData: User | null = null;
  @Input() classTags: string = "";
  private colors: string[] = [
    "ff0000", "ffa500", "ffff00", "008000", "0000ff", "4b0082", "ee82ee",
    "05f9fb", "f9ad7e", "109fac", "63949c", "c9b0b9", "1c1c34", "e182c4"
  ];

  constructor(
    private _httpService: HttpService
  ) {
  }

  getStyle(): string {
    let bgColor: string = this.userData != null ? this.colors[this.userData.id % this.colors.length] : "000000";
    return `border: 1px solid #${bgColor}; background-color: #${bgColor}`;
  }

  getImageSrc(): string {
    return "";
  }
}
