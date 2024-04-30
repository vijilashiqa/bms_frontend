import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmscreditsComponent } from './smscredits.component';

describe('SmscreditsComponent', () => {
  let component: SmscreditsComponent;
  let fixture: ComponentFixture<SmscreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmscreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmscreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
