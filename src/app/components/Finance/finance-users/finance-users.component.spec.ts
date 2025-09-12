import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceUsersComponent } from './finance-users.component';

describe('FinanceUsersComponent', () => {
  let component: FinanceUsersComponent;
  let fixture: ComponentFixture<FinanceUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
