import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmstemplateIspComponent } from './smstemplate-isp.component';

describe('SmstemplateIspComponent', () => {
  let component: SmstemplateIspComponent;
  let fixture: ComponentFixture<SmstemplateIspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmstemplateIspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmstemplateIspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
