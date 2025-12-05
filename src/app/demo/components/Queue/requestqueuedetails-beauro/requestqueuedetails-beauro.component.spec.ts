import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestqueuedetailsComponent } from './requestqueuedetails.component';

describe('RequestqueuedetailsComponent', () => {
  let component: RequestqueuedetailsComponent;
  let fixture: ComponentFixture<RequestqueuedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestqueuedetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestqueuedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

