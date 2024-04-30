import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OttMapComponent } from './ott-map.component';

describe('OttMapComponent', () => {
  let component: OttMapComponent;
  let fixture: ComponentFixture<OttMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OttMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OttMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
