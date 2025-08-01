import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteredKgdsComponent } from './filtered-kgds.component';

describe('FilteredKgdsComponent', () => {
  let component: FilteredKgdsComponent;
  let fixture: ComponentFixture<FilteredKgdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilteredKgdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilteredKgdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
