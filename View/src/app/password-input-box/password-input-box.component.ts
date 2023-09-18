import { Component, EventEmitter, Input, Output } from '@angular/core';
import { zxcvbn } from "@zxcvbn-ts/core";

enum STRENGTH {
  NONE = 0,
  WEAK = 25,
  MEDIAN = 50,
  STRONG = 75,
  EXCELLENT = 100,
}

@Component({
  selector: 'app-password-input-box',
  templateUrl: './password-input-box.component.html',
  styleUrls: ['./password-input-box.component.css']
})
export class PasswordInputBoxComponent {
  @Input() enableStrengthBar: boolean = true;
  @Input() label: string = "";
  @Input() errorMessage: string = "";
  @Input() placeholder: string = "";
  @Output() updatePasswordEvent: EventEmitter<string> = new EventEmitter<string>();
  protected password: string = "";
  protected passwordType: string = "password";

  togglePasswordVisibility(): void {
    this.passwordType = this.passwordType == "password" ? "text" : "password";
  }

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
