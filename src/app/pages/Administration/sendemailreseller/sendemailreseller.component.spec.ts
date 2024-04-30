import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendemailresellerComponent } from './sendemailreseller.component';

describe('SendemailresellerComponent', () => {
  let component: SendemailresellerComponent;
  let fixture: ComponentFixture<SendemailresellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendemailresellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendemailresellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
