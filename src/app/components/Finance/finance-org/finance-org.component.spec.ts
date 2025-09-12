import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceOrgComponent } from './finance-org.component';

describe('FinanceOrgComponent', () => {
  let component: FinanceOrgComponent;
  let fixture: ComponentFixture<FinanceOrgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceOrgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceOrgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
