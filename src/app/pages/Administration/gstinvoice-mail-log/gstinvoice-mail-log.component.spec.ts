import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GstinvoiceMailLogComponent } from './gstinvoice-mail-log.component';

describe('GstinvoiceMailLogComponent', () => {
  let component: GstinvoiceMailLogComponent;
  let fixture: ComponentFixture<GstinvoiceMailLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GstinvoiceMailLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GstinvoiceMailLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
