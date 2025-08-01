import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgdComponent } from './kgd.component';

describe('KgdComponent', () => {
  let component: KgdComponent;
  let fixture: ComponentFixture<KgdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KgdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KgdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
