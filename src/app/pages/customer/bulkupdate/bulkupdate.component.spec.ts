import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkupdateComponent } from './bulkupdate.component';

describe('BulkupdateComponent', () => {
  let component: BulkupdateComponent;
  let fixture: ComponentFixture<BulkupdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkupdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
