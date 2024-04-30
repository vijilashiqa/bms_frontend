import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareLogComponent } from './share-log.component';

describe('ShareLogComponent', () => {
  let component: ShareLogComponent;
  let fixture: ComponentFixture<ShareLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
