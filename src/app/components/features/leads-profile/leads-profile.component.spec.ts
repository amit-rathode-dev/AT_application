import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsProfileComponent } from './leads-profile.component';

describe('LeadsProfileComponent', () => {
  let component: LeadsProfileComponent;
  let fixture: ComponentFixture<LeadsProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
