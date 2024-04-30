import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateottmapComponent } from './updateottmap.component';

describe('UpdateottmapComponent', () => {
  let component: UpdateottmapComponent;
  let fixture: ComponentFixture<UpdateottmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateottmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateottmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
