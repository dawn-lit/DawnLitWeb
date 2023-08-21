import { Component, Input } from '@angular/core';
import { zxcvbn } from "@zxcvbn-ts/core";

enum STRENGTH {
  NONE = 0,
  WEAK = 25,
  MEDIAN = 50,
  STRONG = 75,
  EXCELLENT = 100,
}

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  styleUrls: ['./password-strength-bar.component.css']
})
export class PasswordStrengthBarComponent {
  @Input() password: string = "";

  getStrength(): number {
    switch (zxcvbn(this.password).score) {
      case 1:
        return STRENGTH.WEAK;
      case 2:
        return STRENGTH.MEDIAN;
      case 3:
        return STRENGTH.STRONG;
      case 4:
        return STRENGTH.EXCELLENT;
      default:
        return STRENGTH.NONE;
    }
  }

  getBg(): string {
    switch (zxcvbn(this.password).score) {
      case 1:
        return "bg-danger";
      case 2:
        return "bg-warning";
      case 3:
        return "bg-info";
      case 4:
        return "bg-success";
      default:
        return "bg-danger";
    }
  }
}
