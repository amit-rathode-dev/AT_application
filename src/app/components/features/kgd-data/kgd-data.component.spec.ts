import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KgdDataComponent } from './kgd-data.component';

describe('KgdDataComponent', () => {
  let component: KgdDataComponent;
  let fixture: ComponentFixture<KgdDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KgdDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KgdDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
