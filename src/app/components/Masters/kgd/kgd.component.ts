
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

@Component({
  selector: 'app-kgd',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, MultiSelectModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule],
  templateUrl: './kgd.component.html',
  styleUrl: './kgd.component.css'
})
export class KgdComponent {



  @ViewChild('dt') table!: Table;


  kgdNonAssignedData: any[] = []
  kgdData: any[] = [];
  goemData: any[] = []
  unfilteredGoemData: any[] = [];

  isVisible: boolean = false

  assignkgdForm!: FormGroup

  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService) {

  }


  ngOnInit() {

    this.getKgdData();
    this.getGoemData();
    this.initForm()
  }

  initForm() {

    this.assignkgdForm = this.fb.group({
      assigned_org_id: ['', Validators.required],
      org_id: [[], Validators.required]
    })
  }
  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  closeDialog() {
    this.isVisible = false
    this.assignkgdForm.reset();
  }


  getKgdData() {



    const payload = {
      data_type: 'kgd',
      goem_id: null,
      asm_id: null
    };

    this.commonService.postDataWithBody('api/product/getGoemOrKgdDataForWeb', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.kgdData = res.data.kgd;
          // this.kgdNonAssignedData = this.kgdData.filter((itr: any) => itr.assigned_status == 'Not Assigned' && itr.isactive == 'true');
          
          this.kgdNonAssignedData = this.kgdData.filter((itr: any) =>
            itr.assigned_status === 'Not Assigned' && (itr.isactive == true || itr.isactive == 'true')
        );
        console.log(this.kgdNonAssignedData, '--kgdNonAssignedData------->');


        } else {
          this.modal.showError(res.message || 'Failed to fetch KGD data');
        }
      }
    })
  }


  getGoemData() {

    const payload = {
      data_type: 'goem',
      goem_id: null,
      asm_id: null
    };

    this.commonService.postDataWithBody('api/product/getGoemOrKgdDataForWeb', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          // this.goemData = res.data.goem;
          this.unfilteredGoemData = res.data.goem;
          console.log(
            this.unfilteredGoemData, '-----goem---->'
          );


          this.goemData = this.unfilteredGoemData.filter((item: any) => item.isactive == 'true' || item.isactive === true );

          console.log(this.goemData, '-----eshgjkds---->');
        }
      }
    })
  }




  assignnASM() {


    this.isVisible = true
  }

  onSubmit() {



    if (this.assignkgdForm.invalid) {

      return;
    }

    this.commonService.createData('api/product/assigneASMorGOEM', this.assignkgdForm.value).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.modal.showToast(res.message || 'Asm Assigned Successfully')
          this.getKgdData();
          this.closeDialog();
        } else {
          this.modal.showError(res.message || 'Asm Assign got error')
        }
      }
    })
  }


  deleteKgd(item: any) {
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
        this.commonService.updateData('api/product/deleteKGD', { org_id: item.org_id }).subscribe({
          next: (res: any) => {
            if (res.status == 200 || res.status == 201) {
              this.modal.showToast(res.message || 'Goem Deleted Successfully')
              this.getKgdData()
            } else {
              this.modal.showError(res.message || 'Goem Delete got error')
            }
          }
        })
      }
    })
  }

}
