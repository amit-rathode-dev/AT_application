import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMediComponent } from './view-medi.component';

describe('ViewMediComponent', () => {
  let component: ViewMediComponent;
  let fixture: ComponentFixture<ViewMediComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMediComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMediComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
