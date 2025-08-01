import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaComponentComponent } from './media-component.component';

describe('MediaComponentComponent', () => {
  let component: MediaComponentComponent;
  let fixture: ComponentFixture<MediaComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
