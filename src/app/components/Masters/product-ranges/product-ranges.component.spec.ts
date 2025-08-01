import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRangesComponent } from './product-ranges.component';

describe('ProductRangesComponent', () => {
  let component: ProductRangesComponent;
  let fixture: ComponentFixture<ProductRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRangesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
