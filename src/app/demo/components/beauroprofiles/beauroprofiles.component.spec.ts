import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeauroprofilesComponent } from './beauroprofiles.component';

describe('BeauroprofilesComponent', () => {
  let component: BeauroprofilesComponent;
  let fixture: ComponentFixture<BeauroprofilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeauroprofilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BeauroprofilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

