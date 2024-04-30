import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendsmsothersComponent } from './sendsmsothers.component';

describe('SendsmsothersComponent', () => {
  let component: SendsmsothersComponent;
  let fixture: ComponentFixture<SendsmsothersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendsmsothersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendsmsothersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
