import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReusablemodulesComponent } from './reusablemodules.component';

describe('ReusablemodulesComponent', () => {
  let component: ReusablemodulesComponent;
  let fixture: ComponentFixture<ReusablemodulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReusablemodulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReusablemodulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
