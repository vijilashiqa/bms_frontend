import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlinePaymentReportComponent } from './online-payment-report.component';

describe('OnlinePaymentReportComponent', () => {
  let component: OnlinePaymentReportComponent;
  let fixture: ComponentFixture<OnlinePaymentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlinePaymentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlinePaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
