import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';

import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { SafeUrl } from '@angular/platform-browser';
import { ReusablemodulesComponent } from '../../../../shared/reusablemodules/reusablemodules.component';



@Component({
  selector: 'app-category-type',
  standalone: true,
 imports: [CommonModule, FileUploadModule, ToastModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule],
  templateUrl: './category-type.component.html',
  styleUrl: './category-type.component.css'
})
export class CategoryTypeComponent {

  CreateNew(){

  }


  applyFilterGlobal(event:any){

  }

categoryData: any[]=[]



 deleteCategory(item:any){
  
}

}
