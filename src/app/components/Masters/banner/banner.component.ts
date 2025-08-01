import { Component, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../services/common.service';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../environments/environment';
import { GalleriaModule } from 'primeng/galleria';
interface Attachment {
  'images[]': File;
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}


@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule, FileUploadModule,GalleriaModule, ToastModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent {


  @ViewChild('dt') table!: Table;
  bannerData: any[] = []
  organizations: any[] = []
  screenData: any[] = []
  incomingBannerData: any[] = []

  selectedImages: { file: File; preview: string }[] = [];
  tempselectedImages: any
  visible: boolean = false
  incomingStatus: any
  incomingMessaage: any;
  app_Type: string = '';
  UserValidate: boolean = false
  formSubmitted: boolean = false;
  isInvalidImage: boolean = false;
  isappTypeSelected: boolean = false;
  imgerrormessage: string = '';
  appTypeErrorMessage: string = ''
  isEditing: boolean = false;
  selectedBannerItem: any = null;
  minDate: string = '';
  minToDate: string = '';


  bannerForm!: FormGroup

  public environment = environment.apiUrl




  constructor(private fb: FormBuilder, private modalHandler: ModealHandlerService, private commonService: CommonService) {

  }

  ngOnInit() {
    this.getBannerData()
    this.initForm();
    this.getOrgData();
    this.redirectionData()


  }



  initForm() {
    this.bannerForm = this.fb.group({

      date_from: ['', Validators.required],
      date_to: ['', Validators.required],
      org_id: ['', Validators.required],
      forMobile: [''],
      forWeb: [''],
      forTab: [''],
      // app_type :[''],
      images: [null],
      redirections: this.fb.array([])

    })

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

  }

  get redirections(): FormArray {
    return this.bannerForm.get('redirections') as FormArray;
  }



  getOrgData() {

    this.commonService.getAllData('api/user/getAllOrg').subscribe(
      {
        next: (res: any) => {

          if (res.status == 200) {

            this.organizations = res.data
            console.log('here is the organization data', this.organizations);

          } else {
            console.log('error');
          }

        },
        error: (err) => {
          console.log('error ', err);

        }
      }
    )
  }

  redirectionData() {

    this.commonService.getAllData('api/banner/getAllDataForMobile').subscribe(
      {
        next: (res: any) => {

          if (res.status == 200) {

            this.screenData = res.data
            console.log('here is the organization data', this.organizations);

          } else {
            console.log('error');
          }

        },
        error: (err) => {
          console.log('error ', err);

        }
      }
    )
  }




  onImageSelect(event: any): void {
    const files: FileList = event.target.files;

    if (files && files.length > 0) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const image = new Image();
          image.src = e.target.result;

          image.onload = () => {
            // const width = image.width;
            // const height = image.height;

            // let minWidth: number, maxWidth: number, minHeight: number, maxHeight: number;

            // if (this.app_Type === 'Web') {
            //   minWidth = 1100;
            //   maxWidth = 1300;
            //   minHeight = 300;
            //   maxHeight = 500;
            // } else if (this.app_Type === 'Mobile') {
            //   minWidth = 1280;
            //   maxWidth = 1380;
            //   minHeight = 720;
            //   maxHeight = 820;
            // } else {
            //   // alert('❌ Please select a valid App Type');
            //   this.isappTypeSelected = false
            //   this.appTypeErrorMessage = 'please select a valid App Type'
            //   return;
            // }

            // const isWidthValid = width >= minWidth && width <= maxWidth;
            // const isHeightValid = height >= minHeight && height <= maxHeight;

            // if (!isWidthValid || !isHeightValid) {

            //   this.isInvalidImage = true
            //   this.imgerrormessage = ` Invalid dimensions for ${file.name}.\n\n    Allowed width: ${minWidth}px to ${maxWidth}px\n
            //    Allowed height: ${minHeight}px to ${maxHeight}px\n\n  Your image is: ${width}px x ${height}px
            //    `
            // } else {
            this.selectedImages.push({
              file: file,
              preview: e.target.result
            });

            this.redirections.push(this.fb.group({
              forWeb: [''],
              forMobile: [''],
              forTab: ['']
            }));

            this.isInvalidImage = false

            console.log('✅ Valid image added:', this.selectedImages);
            console.log('📍 Redirections:', this.redirections);
            // }
          };
        };

        reader.readAsDataURL(file);
      });

      // Allow re-uploading same file again if needed
      event.target.value = '';
    }
  }


  onOrganizationChange() {
    this.incomingStatus = '';
    this.incomingMessaage = '';
  }



  createBanner() {


    this.bannerForm.markAllAsTouched();

    if (this.bannerForm.invalid) {
      return;
    }


    const formData = new FormData();

    const dateFrom = this.bannerForm.value.date_from || '';
    const dateTo = this.bannerForm.value.date_to || '';
    const orgId = this.bannerForm.value.org_id || '';
    const appType = this.app_Type;


    formData.append('date_from', dateFrom);
    formData.append('date_to', dateTo);
    formData.append('org_id', orgId);
    formData.append('app_type', appType);


    this.selectedImages.forEach((image: any, index: number) => {
      if (image.file) {
        formData.append(`attachment`, image.file, image.file.name);
      } else {
        console.error("Image file is missing or invalid", image);
      }
    });


    const forWeb: string[] = [];
    const forMobile: string[] = [];
    const forTab: string[] = [];

    this.bannerForm.value.redirections.forEach((redirection: any) => {
      if (redirection.forWeb) {
        forWeb.push(redirection.forWeb);
      }
      if (redirection.forMobile) {
        forMobile.push(redirection.forMobile);
      }
      if (redirection.forTab) {
        forTab.push(redirection.forTab);
      }
    });


    formData.append('forWeb', JSON.stringify(forWeb));
    formData.append('forMobile', JSON.stringify(forMobile));
    formData.append('forTab', JSON.stringify(forTab));

    this.formSubmitted = true
    this.UserValidate = true

    if (this.bannerForm.invalid) {
      console.log('here is banner form in invalid', this.bannerForm);

      return
    }


    this.commonService.createData('api/banner/createBanner', formData).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.closeDialog()
          this.getBannerData();
          this.modalHandler.showToast(res.message || 'Banner Created Successfully');
        } else if (res.status == 409) {
          // this.visible=false
          this.incomingStatus = res.status
          this.incomingMessaage = res.message

        } else {
          this.modalHandler.showError(res.err || 'Banner Creation has been gone wrong');
        }
      }
    });
  }



  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.redirections.removeAt(index);
  }



  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  CreateNew() {
    this.visible = true
  }

  closeDialog() {

    this.visible = false;
    this.bannerForm.reset();
    this.isInvalidImage = false;
    this.isappTypeSelected = false;
    this.selectedImages = [];
    this.bannerForm.reset()



  }

  submitForm() {
    this.createBanner();
  }

  removeImg(index: number): void {
    this.selectedImages.splice(index, 1);
  }



  getBannerData() {
    this.commonService.getAllData('api/banner/getAllBanner').subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.bannerData = res.data

          console.log('here is incoming Data', this.bannerData);

        }
      }
    })
  }


  deleteBanner(item: any) {


    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the Banner. This action cannot be undone.',
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
        this.deleteBannerData(item)
        Swal.fire({
          title: 'Deleted!',
          text: 'Your Banner has been deleted.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 2000,
          timerProgressBar: true
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Banner is safe.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 1000,
          timerProgressBar: true
        });

      }
    });
  }


  deleteBannerData(item: any) {

    console.log('hrerehre', item);

    this.commonService.deleteDataWithQueryParams('api/banner/deleteBanner', { id: item.id }).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {
          this.getBannerData();

          this.visible = false;
        } else {

          console.log('Invalid ', res);
        }
      },
      error: (err) => {

      }
    });
  }


  errorMessageChange(event: any): void {
    const selectedValue = event.target.value;
    if (selectedValue) {
      this.isappTypeSelected = true;
      this.appTypeErrorMessage = '';
    } else {
      this.isappTypeSelected = false;
      this.appTypeErrorMessage = 'Please select an app type.';
    }
  }

  appTypeChanges(event: any) {

    this.selectedImages = []
  }

  editBanner(item: any) {
    this.isEditing = true;
    this.selectedBannerItem = item;
    console.log(item, 'here are new items');


    this.bannerForm.patchValue({
      // title_id: Number(user.title_id) || '',
      date_from: item?.first_name || '',
      date_to: item?.user_name || '',
      last_name: item?.last_name || '',
      email: item?.email || '',
      phone_number: item?.phone_number || '',
      org_id: Number(item.org_id) || '',
      // org_id: user.org_id || '',
      department: item?.department || '',
      reporting_id: item?.reporting_id || '',
      role_id: item?.user_role_id || '',
      role_name: item.user_role_id,
      user_id: item?.user_id || ''

    });
  }
  // date_from: ['', Validators.required],
  //   date_to: ['', Validators.required],
  //   org_id: ['', Validators.required],
  //   forMobile: [''],
  //   forWeb: [''],
  //   forTab: [''],
  //   // app_type :[''],
  //   images: [null],
  //   redirections: this.fb.array([])


  selectedBannerImages: any[] = [];
  bannerimages:any[]=[];
  imageDialogVisible:boolean=false


 openImageDialog(bannerId: number): void {
  const banner = this.bannerData.find(p => p.id === bannerId);

  if (banner && banner.attachments?.length) {
    // Map prod_path to the image object expected by galleria
    this.selectedImages = banner.attachments.map((att: { prod_path: any; }) => ({
      product_image: att.prod_path
    }));

    this.imageDialogVisible = true;
  } else {
    this.selectedImages = [];
    this.imageDialogVisible = false;
  }
}


  closeImageDialog(){
      this.imageDialogVisible = false;

  }

}

