import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FootearComponent } from './footear.component';

describe('FootearComponent', () => {
  let component: FootearComponent;
  let fixture: ComponentFixture<FootearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FootearComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FootearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
