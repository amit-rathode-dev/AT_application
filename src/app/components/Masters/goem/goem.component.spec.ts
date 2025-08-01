import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoemComponent } from './goem.component';

describe('GoemComponent', () => {
  let component: GoemComponent;
  let fixture: ComponentFixture<GoemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
