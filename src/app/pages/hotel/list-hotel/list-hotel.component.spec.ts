import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHotelComponent } from './list-hotel.component';

describe('ListHotelComponent', () => {
  let component: ListHotelComponent;
  let fixture: ComponentFixture<ListHotelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListHotelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHotelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
