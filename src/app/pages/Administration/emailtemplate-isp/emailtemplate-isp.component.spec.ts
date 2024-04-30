import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtemplateIspComponent } from './emailtemplate-isp.component';

describe('EmailtemplateIspComponent', () => {
  let component: EmailtemplateIspComponent;
  let fixture: ComponentFixture<EmailtemplateIspComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailtemplateIspComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtemplateIspComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
