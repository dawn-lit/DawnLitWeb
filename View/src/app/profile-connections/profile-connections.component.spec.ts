import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileConnectionsComponent } from './profile-connections.component';

describe('ProfileConnectionsComponent', () => {
  let component: ProfileConnectionsComponent;
  let fixture: ComponentFixture<ProfileConnectionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileConnectionsComponent]
    });
    fixture = TestBed.createComponent(ProfileConnectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
