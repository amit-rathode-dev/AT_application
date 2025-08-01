import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSpecificationComponent } from './edit-specification.component';

describe('EditSpecificationComponent', () => {
  let component: EditSpecificationComponent;
  let fixture: ComponentFixture<EditSpecificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSpecificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
