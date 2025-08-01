import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerMediaComponent } from './partner-media.component';

describe('PartnerMediaComponent', () => {
  let component: PartnerMediaComponent;
  let fixture: ComponentFixture<PartnerMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartnerMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartnerMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
