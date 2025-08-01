import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator'; import { ReusablemodulesComponent } from '../../../shared/reusablemodules/reusablemodules.component';
import { CommonService } from '../../../../services/common.service';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { CategoryTypeComponent } from '../category-type/category-type.component';
import { ShareddataserviceService } from '../../../../services/shareddataservice.service';


@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css'
})
export class CategoryFormComponent {


  categoryTypeForm!: FormGroup;
  selectedImageFile: File | null = null;
  imageRequiredError = false;

  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService, private videoService: VideoplayerService,private router: Router,  private sharedDataService: ShareddataserviceService) { 
    this.categoryTypeForm = this.fb.group({});  

  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    this.categoryTypeForm = this.fb.group({
      type: ['', Validators.required],
      image: ['', Validators.required]
    })
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.selectedImageFile = file;
      this.imageRequiredError = false;
    }
  }

  submitForm(): void {
    if (this.categoryTypeForm.invalid || !this.selectedImageFile) {
      if (!this.selectedImageFile) {
        this.imageRequiredError = true;
      }
      this.categoryTypeForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('name', this.categoryTypeForm.get('type')?.value);
    formData.append('attachment', this.selectedImageFile as Blob);

    this.commonService.createData('api/categories/createCategoriesType', formData).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.modalHandler.showToast(res.message || 'category type added successfully')
          
          this.router.navigate(['/category-type']);
            this.sharedDataService.notifyDataUpdate();
          this.closeDialog()

        } else {
          this.modalHandler.showError(res.message || 'Categoryt type creation error')
          this.closeDialog()
        }
      }, error(err) {
        console.log(err);

      },
    })

  }



  closeDialog() {
    this.categoryTypeForm.reset();
    this.videoService.closeVideoPlayer();
  }


}
