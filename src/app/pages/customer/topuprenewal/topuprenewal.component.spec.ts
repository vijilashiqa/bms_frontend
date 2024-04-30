import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopuprenewalComponent } from './topuprenewal.component';

describe('TopuprenewalComponent', () => {
  let component: TopuprenewalComponent;
  let fixture: ComponentFixture<TopuprenewalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopuprenewalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopuprenewalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
