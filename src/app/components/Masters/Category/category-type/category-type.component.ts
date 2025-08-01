import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../../services/common.service';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { CategoryDetailsComponent } from '../category-details/category-details.component';
import { environment } from '../../../../../environments/environment';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ShareddataserviceService } from '../../../../services/shareddataservice.service';

@Component({
  selector: 'app-category-type',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, CategoryFormComponent],
  templateUrl: './category-type.component.html',
  styleUrl: './category-type.component.css'
})
export class CategoryTypeComponent {



  @ViewChild('dt') table!: Table;

  public environment = environment.apiUrl;
  categoryData: any = []
  isVisible: boolean = false
  incomingCatTypeData:any =[]




  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService, private videoPlayerService: VideoplayerService,private sharedDataService: ShareddataserviceService) {

  }


  async ngOnInit() {

     await this.getCategoryTypeData()

    this.videoPlayerService.showPopup$.subscribe(show => {
      this.isVisible = show;
    })

     this.sharedDataService.dataUpdated$.subscribe(() => {
    this.getCategoryTypeData(); // fetch again when abc submits
  });

  }



  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  createNew() {
    this.isVisible = true
    this.videoPlayerService.addFormData();

  }


  getCategoryTypeData(){
    this.commonService.getAllData('api/categories/getAllCategoriesType').subscribe({
      next:(res:any)=>{
        if(res.status===200 || res.status==201){
          this.incomingCatTypeData=res.data
          console.log(this.incomingCatTypeData,'here is incoming category Type data');
          
        }
      }
    })
  }



}
