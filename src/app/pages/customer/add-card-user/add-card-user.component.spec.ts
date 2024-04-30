import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCardUserComponent } from './add-card-user.component';

describe('AddCardUserComponent', () => {
  let component: AddCardUserComponent;
  let fixture: ComponentFixture<AddCardUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCardUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCardUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
