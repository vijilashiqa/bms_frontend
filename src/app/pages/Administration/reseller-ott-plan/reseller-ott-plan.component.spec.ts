import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerOttPlanComponent } from './reseller-ott-plan.component';

describe('ResellerOttPlanComponent', () => {
  let component: ResellerOttPlanComponent;
  let fixture: ComponentFixture<ResellerOttPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerOttPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerOttPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
