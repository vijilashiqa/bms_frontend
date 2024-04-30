import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttLogComponent } from './ott-log.component';

describe('OttLogComponent', () => {
  let component: OttLogComponent;
  let fixture: ComponentFixture<OttLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
