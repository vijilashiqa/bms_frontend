import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceMailLogComponent } from './invoice-mail-log.component';

describe('InvoiceMailLogComponent', () => {
  let component: InvoiceMailLogComponent;
  let fixture: ComponentFixture<InvoiceMailLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceMailLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceMailLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
