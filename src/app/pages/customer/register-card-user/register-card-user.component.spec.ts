import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCardUserComponent } from './register-card-user.component';

describe('RegisterCardUserComponent', () => {
  let component: RegisterCardUserComponent;
  let fixture: ComponentFixture<RegisterCardUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterCardUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
