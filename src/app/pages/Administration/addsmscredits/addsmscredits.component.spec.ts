import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsmscreditsComponent } from './addsmscredits.component';

describe('AddsmscreditsComponent', () => {
  let component: AddsmscreditsComponent;
  let fixture: ComponentFixture<AddsmscreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsmscreditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsmscreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
