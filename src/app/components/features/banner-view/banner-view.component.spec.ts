import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerViewComponent } from './banner-view.component';

describe('BannerViewComponent', () => {
  let component: BannerViewComponent;
  let fixture: ComponentFixture<BannerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
