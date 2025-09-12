import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicUserFormComponent } from './dynamic-user-form.component';

describe('DynamicUserFormComponent', () => {
  let component: DynamicUserFormComponent;
  let fixture: ComponentFixture<DynamicUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicUserFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
