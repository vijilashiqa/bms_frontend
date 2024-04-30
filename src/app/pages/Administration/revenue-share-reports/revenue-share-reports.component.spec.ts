import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueShareReportsComponent } from './revenue-share-reports.component';

describe('RevenueShareReportsComponent', () => {
  let component: RevenueShareReportsComponent;
  let fixture: ComponentFixture<RevenueShareReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevenueShareReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueShareReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
