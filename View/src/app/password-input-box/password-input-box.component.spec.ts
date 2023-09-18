import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordInputBoxComponent } from './password-input-box.component';

describe('PasswordInputBoxComponent', () => {
  let component: PasswordInputBoxComponent;
  let fixture: ComponentFixture<PasswordInputBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordInputBoxComponent]
    });
    fixture = TestBed.createComponent(PasswordInputBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
