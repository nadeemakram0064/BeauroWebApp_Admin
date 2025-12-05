import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualprofilesComponent } from './individualprofiles.component';

describe('IndividualprofilesComponent', () => {
  let component: IndividualprofilesComponent;
  let fixture: ComponentFixture<IndividualprofilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualprofilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


