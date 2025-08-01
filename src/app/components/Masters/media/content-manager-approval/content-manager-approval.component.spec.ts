import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentManagerApprovalComponent } from './content-manager-approval.component';

describe('ContentManagerApprovalComponent', () => {
  let component: ContentManagerApprovalComponent;
  let fixture: ComponentFixture<ContentManagerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentManagerApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentManagerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
