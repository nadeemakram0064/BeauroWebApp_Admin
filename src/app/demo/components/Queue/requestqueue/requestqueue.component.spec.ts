import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestqueueComponent } from './requestqueue.component';

describe('RequestqueueComponent', () => {
  let component: RequestqueueComponent;
  let fixture: ComponentFixture<RequestqueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestqueueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


