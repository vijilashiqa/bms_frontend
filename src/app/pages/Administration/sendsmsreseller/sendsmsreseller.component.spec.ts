import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendsmsresellerComponent } from './sendsmsreseller.component';

describe('SendsmsresellerComponent', () => {
  let component: SendsmsresellerComponent;
  let fixture: ComponentFixture<SendsmsresellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendsmsresellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendsmsresellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
