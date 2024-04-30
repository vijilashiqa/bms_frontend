import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResellerRevenueShareComponent } from './reseller-revenue-share.component';

describe('ResellerRevenueShareComponent', () => {
  let component: ResellerRevenueShareComponent;
  let fixture: ComponentFixture<ResellerRevenueShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellerRevenueShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellerRevenueShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
