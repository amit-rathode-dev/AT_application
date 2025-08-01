
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
import { MultiSelectModule } from 'primeng/multiselect';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ApiResponse } from '../../../helpers/models/masters';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';
import { TooltipModule } from 'primeng/tooltip';


interface DropdownChangeEvent {
  value: any;            // the selected optionValue (user_id in your case)
  originalEvent: Event;  // browser event, if you need it
}


@Component({
  selector: 'app-goem',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, MultiSelectModule, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, NoDataPipe, TooltipModule,],
  templateUrl: './goem.component.html',
  styleUrl: './goem.component.css'
})
export class GoemComponent {




  @ViewChild('dt') table!: Table;

  goemData: any[] = []
  goemNonAssignedData: any[] = []
  notAssignedGoem: any[] = [];
  asmData: any[] = [];
  isVisible: boolean = false
  destroy$ = new Subject<void>();

  assignasmForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService) {

  }


  ngOnInit() {

    this.getGoemData();
    this.getAsmData();
    this.initForm()
  }

  initForm() {

    this.assignasmForm = this.fb.group({

      assigned_org_id: [''],
      org_id: [''],
      asm_id: ['', Validators.required],
    })
  }

  getGoemData() {
    const payload = {
      data_type: 'goem',
      goem_id: null,
      asm_id: null
    };

    this.commonService.postDataWithBody('api/product/getGoemOrKgdDataForWeb', payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          // if (res.status == 200 || res.status == 201) {
          const response = res as ApiResponse<any>;
          this.goemData = response.data.goem;
          console.log(this.goemData, '--------->');


        },
        error: (err) => {
          this.modal.showError(
            err.error.message ? err.error.message : 'Something went wrong!'
          );
        }
      })
  }


  getAsmData() {
    const user_type = "asm";
    this.commonService.postDataWithBody('api/product/getUserForAssignment', { user_type }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.asmData = res.data.asm
        }
      }
    })
  }


  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  closeDialog() {
    this.isVisible = false
    this.assignasmForm.reset();
  }


  assignnASM() {


    this.goemNonAssignedData = this.goemData.filter((itr: any) => itr.assigned_status == 'Not Assigned' && itr.isactive == true);


    console.log('here assigned user', this.goemNonAssignedData);

    this.isVisible = true
  }

  // onAsmSelect(event: Event) {
  //   const selectedUserId = (event.target as HTMLSelectElement).value;
  //   const selectedAsm = this.asmData.find(item => item.user_id == selectedUserId); // loose equality

  //   if (selectedAsm && selectedAsm.org_id) {
  //     console.log('Setting org_id to:', selectedAsm.org_id);
  //     this.assignasmForm.patchValue({ assigned_org_id: selectedAsm.org_id });
  //   } else {
  //     console.warn('No matching ASM found or org_id missing');
  //   }
  // }

  // ⬅️ NEW import (optional but helps with typing)

  
  onAsmSelect(event: DropdownChangeEvent): void {
    const selectedUserId = event.value;
    if (!selectedUserId) {
      this.assignasmForm.patchValue({ assigned_org_id: null });
      return;
    }
    const selectedAsm = this.asmData.find(
      asm => asm.user_id === selectedUserId
    );
    if (selectedAsm?.org_id) {
      this.assignasmForm.patchValue({ assigned_org_id: selectedAsm.org_id });
    } else {
      console.warn('No matching ASM found or org_id missing');
      this.assignasmForm.patchValue({ assigned_org_id: null });
    }
  }



  onSubmit() {



    this.assignasmForm.markAllAsTouched();



    if (this.assignasmForm.invalid) {
      this.assignasmForm.markAllAsTouched();
      return;
    }


    this.commonService.createData('api/product/assigneASMorGOEM', {
      ...this.assignasmForm.value,
      asm_id: Number(this.assignasmForm.value.asm_id)
    }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.modal.showToast(res.message || 'Asm Assigned Successfully')
          this.getGoemData()
          this.closeDialog();
        } else {
          this.modal.showError(res.message || 'Asm Assign got error')
        }
      }
    })
  }


  deleteGoem(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
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
        this.commonService.updateData('api/product/deleteGOEM', { org_id: item.org_id }).subscribe({
          next: (res: any) => {
            if (res.status == 200 || res.status == 201) {
              this.modal.showToast(res.message || 'Goem Deleted Successfully')
              this.getGoemData()
              
            } else {
              this.modal.showError(res.message || 'Goem Delete got error')
            }
          }
        })
      }
    })
  }
}
