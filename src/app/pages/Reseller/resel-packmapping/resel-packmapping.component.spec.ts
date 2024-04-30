import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResServiceMapComponent } from './resel-packmapping.component';

describe('SmstemplateIspComponent', () => {
  let component: ResServiceMapComponent;
  let fixture: ComponentFixture<ResServiceMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResServiceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResServiceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
