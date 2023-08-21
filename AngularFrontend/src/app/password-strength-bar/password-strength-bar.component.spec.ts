import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordStrengthBarComponent } from './password-strength-bar.component';

describe('PasswordStrengthBarComponent', () => {
  let component: PasswordStrengthBarComponent;
  let fixture: ComponentFixture<PasswordStrengthBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordStrengthBarComponent]
    });
    fixture = TestBed.createComponent(PasswordStrengthBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
