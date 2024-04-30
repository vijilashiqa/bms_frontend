import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshScheduleComponent } from './refresh-schedule.component';

describe('RefreshScheduleComponent', () => {
  let component: RefreshScheduleComponent;
  let fixture: ComponentFixture<RefreshScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
