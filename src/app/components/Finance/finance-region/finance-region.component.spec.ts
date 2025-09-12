import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceRegionComponent } from './finance-region.component';

describe('FinanceRegionComponent', () => {
  let component: FinanceRegionComponent;
  let fixture: ComponentFixture<FinanceRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceRegionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
