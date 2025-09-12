import { Component, ViewChild, OnDestroy, OnInit, signal } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import Swal from 'sweetalert2';
import { ApiResponse, roles } from '../../../helpers/models/masters';

import { ToastService } from '../../shared/services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';


@Component({
  selector: 'app-finance-users',
  standalone: true,
imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, NoDataPipe],
  
  templateUrl: './finance-users.component.html',
  styleUrl: './finance-users.component.css'
})
export class FinanceUsersComponent {

  financeUsers!: FormGroup;
  @ViewChild('dt') table!: Table;
  visible: boolean = false;
  destroy$ = new Subject<void>();
  financeOrgData:any[] = [];
    selectedFinanceOrg: any[] = [];
    addedUserDetails: any[] = [];

    financeOrg:any[] =[{
    id: '1', name: 'Chola'
  }, { id: '2', name: 'Bajaj' },
  { id: '3', name: 'IIFL' },
];
    zoneData: any[] = [{
    id: 'South', name: 'South'
  }, { id: 'North', name: 'North' },
  { id: 'West', name: 'West' },
{ id: 'East', name: 'East' }];

departmentList: any[] = []
orgTypeData: any[] = []
branchData: any[] = [{id: '1', name: 'Branch 1'}, {id: '2', name: 'Branch 2'}, {id: '3', name: 'Branch 3'}];

asmData: any[] = [{id: '1', name: 'asm 1'}, {id: '2', name: 'asm 2'}, {id: '3', name: 'asm 3'}];


  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService, private toastService: ToastService,) {

  }

  ngOnInit() {
    this.initForm();
    this.getFinanceData();
  }

  initForm(): void {
    this.financeUsers = this.fb.group({
      name: ['', Validators.required],
      selectedOrg: [null, Validators.required],
      selectedZone: [null, Validators.required],
      mobileNumber:[],
      selectedBranch:[],
      financeName:[null],
      selectedRegion:[ null],
      selectedAsm: [null],

    })
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  isSelected(item: any): boolean {
    return this.selectedFinanceOrg.some(selectedItem => selectedItem.id == item.id);
  }

  createNew() {
    this.visible = true;
  }

  closeDialog() {
    this.financeUsers.reset();
    this.visible = false;
  }




  getFinanceData() {
    this.commonService.getAllData('api/user/getAllFinanceOrg')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const response = res as ApiResponse<roles[]>;
          this.financeOrgData = response.data || [];


        },
        error: (err) => {
          this.modal.showError(
            err.error.message ? err.error.message : 'Something went wrong!'
          );
        }
      });
  }

  submitForm() {
    this.financeUsers.markAllAsTouched();
    if (this.financeUsers.invalid) {
      return;
    }

    this.commonService.createData('api/user/createRole', this.financeUsers.value).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.modal.showToast(res.message || 'User Added successfully', 'success');
          this.getFinanceData();
          this.closeDialog();
          this.modal.showToast(res.message || 'Role Added successfully', 'success');
        } else {
          this.modal.showError(res.message || 'User Added gone Wrong');
          this.closeDialog();
        }

      },
      error: (err) => {
        this.modal.showError(
          err.error.message ? err.error.message : 'Something went wrong!'
        );
        this.closeDialog();
      }
    });
  }


  deleteRole(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the finance Org. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      reverseButtons: true,
      buttonsStyling: false,
     customClass: {
        confirmButton: 'swal2-confirm-custom',
        cancelButton: 'swal2-cancel-custom',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteItem(item)

      } else if (result.dismiss === Swal.DismissReason.cancel) {

         Swal.fire({
          title: 'Cancelled!',
          text: 'finance Org is safe.',
          icon: 'success',
          confirmButtonColor: '#008080',     
          timer: 1000,               
          timerProgressBar: true
        });

      }
    });
  }

  deleteItem(item: any) {
    this.commonService.deleteData('api/user/deleteRole/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          this.getFinanceData();
          this.modal.showToast(res.message || 'Role Deleted successfully', 'success');
          this.closeDialog()
        } else {
          this.modal.showError(res['message']);
        }
      },
      error: (err) => {
        console.error('Login failed', err);
      }
    });
  }



  addUserDetails() {
  // const selectedId = this.orgForm.get('selectedDepartmentId')?.value;
  // if (!selectedId) return;

  // const department = this.departmentList.find(dep => dep.id === selectedId);
  // const exists = this.addedDepartments.find(dep => dep.id === selectedId);

  // if (department && !exists) {
  //   this.addedDepartments.push({ id: department.id, name: department.name });
  // }

  // // Reset form control value
  // this.orgForm.get('selectedDepartmentId')?.setValue('');
}

}
