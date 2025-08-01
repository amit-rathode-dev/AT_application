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

export function roleExistsValidator(existingRoles: { id: number; name: string }[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !existingRoles?.length) return null;

    const input = control.value.trim().toLowerCase();

    const exists = existingRoles.some(role => role.name.trim().toLowerCase() === input);
    return exists ? { roleExists: true } : null;
  };
}


@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, NoDataPipe],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})

export class RoleManagementComponent {


  @ViewChild('dt') table!: Table;
  roleForm!: FormGroup;
  visible: boolean = false;
  roles: any[] = []
  selectedRole: any[] = [];
  users: any[] = [];
  destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService, private toastService: ToastService,) {

  }

  ngOnInit() {
    this.initForm();
    this.getRoleData();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      name: ['', Validators.required],
    })
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  isSelected(item: any): boolean {
    return this.selectedRole.some(selectedItem => selectedItem.id == item.id);
  }

  createNewUser() {
    this.visible = true;
  }

  closeDialog() {
    this.roleForm.reset();
    this.visible = false;
  }

  applyRoleNameValidators(): void {
    const nameControl = this.roleForm.get('name');
    if (!nameControl) return;
    nameControl.setValidators([
      Validators.required,
      roleExistsValidator(this.roles)
    ]);
    nameControl.updateValueAndValidity();
  }



  getRoleData() {
    this.commonService.getAllData('api/user/getAllRole')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const response = res as ApiResponse<roles[]>;
          this.roles = response.data || [];
          this.applyRoleNameValidators();

        },
        error: (err) => {
          this.modal.showError(
            err.error.message ? err.error.message : 'Something went wrong!'
          );
        }
      });
  }

  submitForm() {
    this.roleForm.markAllAsTouched();
    if (this.roleForm.invalid) {
      return;
    }

    this.commonService.createData('api/user/createRole', this.roleForm.value).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.modal.showToast(res.message || 'User Added successfully', 'success');
          this.getRoleData();
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
      text: 'You are about to delete the Role. This action cannot be undone.',
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
          text: 'Role is safe.',
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
          this.getRoleData();
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


}
