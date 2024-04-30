import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopupreportComponent } from './topupreport.component';

describe('TopupreportComponent', () => {
  let component: TopupreportComponent;
  let fixture: ComponentFixture<TopupreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopupreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopupreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
