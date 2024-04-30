import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmstemplatesComponent } from './smstemplates.component';

describe('SmstemplatesComponent', () => {
  let component: SmstemplatesComponent;
  let fixture: ComponentFixture<SmstemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmstemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmstemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
