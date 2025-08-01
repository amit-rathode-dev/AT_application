import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonService } from '../../../services/common.service';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { CommonModule } from '@angular/common';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-add-fuel',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule],
  templateUrl: './add-fuel.component.html',
  styleUrl: './add-fuel.component.css'
})
export class AddFuelComponent {


  @ViewChild('dt') table!: Table;
  fuelForm!: FormGroup;

  visible: boolean = false;
  FuelData: any[] = []
  selectedRole: any[] = [];
  users: any[] = [];

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService) {

  }

  ngOnInit() {
    this.initForm();
    this.getRoleData();
  }



  initForm(): void {
    this.fuelForm = this.fb.group({
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
  getRoleData() {
    this.commonService.getAllData('api/categories/getAllFuel').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.FuelData = res.data
          console.log('here are roles', this.FuelData);

        } else {

          console.log('Invalid ', res);
        }

      },
      error: (err: any) => {
        console.error('Login failed', err);
      }
    });
  }

  submitForm() {

    this.fuelForm.markAllAsTouched();

    if (this.fuelForm.invalid) {
      return;  
    }

    this.commonService.createData('api/categories/createFuel', this.fuelForm.value).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.modal.showToast(res.message || 'User Added successfully', 'success');
          this.getRoleData();
          this.visible = false;
          this.modal.showToast(res.message || 'Role Added successfully', 'success');
        } else {
          this.modal.showError(res.message || 'User Added gone Wrong');
        }

      },
      error: (err) => {
        this.modal.showError(err.message || 'Role Adding Issue');
        console.error('Login failed', err);
      }
    });
  }


  closeDialog() {
    this.fuelForm.reset();
    this.visible = false;
  }

  editRole(item: any) {

  }



  deleteFuel(item: any) {

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
        // Swal.fire('Deleted!', 'Your Role has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire('Cancelled', 'Your Role is safe :)', 'info');
      }
    });

  }

  deleteItem(item: any) {
    this.commonService.deleteData('api/user//', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          this.getRoleData();
          this.visible = false;
          this.modal.showToast(res.message || 'Fuel Deleted Successfully')
        } else {
          console.log('Invalid ', res);
          this.modal.showError(res.error)
        }
      },
      error: (err: any) => {
        console.error('Login failed', err);
      }
    });
  }
}
