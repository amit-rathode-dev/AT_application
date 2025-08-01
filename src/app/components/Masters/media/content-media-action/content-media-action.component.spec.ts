import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentMediaActionComponent } from './content-media-action.component';

describe('ContentMediaActionComponent', () => {
  let component: ContentMediaActionComponent;
  let fixture: ComponentFixture<ContentMediaActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentMediaActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentMediaActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
