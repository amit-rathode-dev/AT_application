import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusableDialogComponent } from './reusable-dialog.component';

describe('ReusableDialogComponent', () => {
  let component: ReusableDialogComponent;
  let fixture: ComponentFixture<ReusableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
