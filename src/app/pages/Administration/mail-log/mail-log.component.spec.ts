import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailLogComponent } from './mail-log.component';

describe('MailLogComponent', () => {
  let component: MailLogComponent;
  let fixture: ComponentFixture<MailLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
