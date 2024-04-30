import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSimUseComponent } from './change-sim-use.component';

describe('ChangeSimUseComponent', () => {
  let component: ChangeSimUseComponent;
  let fixture: ComponentFixture<ChangeSimUseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeSimUseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSimUseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
