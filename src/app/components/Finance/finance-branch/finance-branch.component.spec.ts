import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceBranchComponent } from './finance-branch.component';

describe('FinanceBranchComponent', () => {
  let component: FinanceBranchComponent;
  let fixture: ComponentFixture<FinanceBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceBranchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
