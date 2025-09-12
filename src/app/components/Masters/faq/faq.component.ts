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
import { filter, Subject, takeUntil } from 'rxjs';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, NoDataPipe],

  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent {

  @ViewChild('dt') table!: Table;
  visible: boolean = false;
  destroy$ = new Subject<void>();
  incomingData: any[] = [];
  faqData: any[] = [];
  faqForm!: FormGroup;
  selectedFinanceOrg: any[] = [];


  categoryData: any[] = [];
  nodeData: any[] = [];
  filteredNodeData: any[] = [];


  constructor(private fb: FormBuilder, private router: Router, private commonService: CommonService, private modal: ModealHandlerService, private toastService: ToastService,) {

  }

  ngOnInit() {
    this.initForm();
    this.getcategoryData()
    this.getnodeData();
    this.getFaqData();
  }

  initForm(): void {
    this.faqForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      category_id: [null, Validators.required],
      product_id: [null, Validators.required],
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
    this.faqForm.reset();
    this.visible = false;
  }




  getFaqData() {
    const payload = { product_id: 0 };

    this.commonService.postDataWithBody('api/product/getProductFAQ', payload)

      .subscribe({
        next: (res: any) => {
          if (res.status === 200 || res.status === 201) {
            this.incomingData = res.product_faq || [];

            this.faqData = this.incomingData.flatMap((item: any) =>
              item.faq.map((faqItem: any) => ({
                product_id: item.product_id,
                product_name: item.product_name || 'N/A',
                category_id: item.category_id,
                category_name: item.category_name || 'N/A',
                question: faqItem.question,
                answer: faqItem.answer,
                faq_id: faqItem.id
              }))
            );

            console.log(this.faqData, 'flattened FAQ data');
          } else {
            console.log(res, 'here is the error data');
          }

        },
        error: (err) => {
          console.log(err, 'here is the error data');
        }

      });
  }


  getcategoryData() {

    const category_type_id = 0
    this.commonService.getAllDataWithParams('api/categories/getCategories', { category_type_id }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {


          this.categoryData = res.data
            .filter((category: any) => category.isactive === true)

            .map((category: any) => ({
              id: category.id,
              name: category.name,
              // description: category.description,
              // lowRange: category.lowRange,
              // highRange: category.highRange,
              // fuel: category.fuel,
              // is_active: category.isactive,
            }));

          console.log(this.categoryData, 'here is the vategory data');



          // this.catData = res.data.map((category: any) => ({
          //   id: category.id,
          //   name: category.name,
          // }));


        }
      }
    })
  }


  getnodeData() {
    this.commonService.getAllData('api/product/getProductList').subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          const incomingNodeData = res.data || [];
          this.nodeData = incomingNodeData
            .filter((itr: any) => itr.isactive === true)
            .map((itr: any) => ({
              id: itr.id,
              name: itr.product_name,
              category_name: itr.category_name,
              category_id: itr.category_id,
            }));
          console.log(this.nodeData, 'here is the node data');

        } else {
          this.modal.showError(res.message || 'Failed to fetch node data');
        }
      }
    })
  }


  onCategoryChange() {
    const cat_id = this.faqForm.get('category_id')?.value; // already number
    console.log('Selected Category ID:', cat_id);

    console.log(this.nodeData, 'here is the node data before filtering');

    this.filteredNodeData = this.nodeData.filter(
      (node: any) => node.category_id === cat_id
    );

    console.log(this.filteredNodeData, 'here is the filtered node data based on category selection');
  }



  submitForm() {
    this.faqForm.markAllAsTouched();
    if (this.faqForm.invalid) {
      return;
    }

    this.commonService.createData('api/product/createProductFAQ', this.faqForm.value).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.modal.showToast(res.message || 'FAQ Added successfully', 'success');
          this.getFaqData();
          this.closeDialog();
          // this.modal.showToast(res.message || 'Role Added successfully', 'success');
        } else {
          this.modal.showError(res.message || 'FAQ Added gone Wrong');
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
          this.getFaqData();
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
