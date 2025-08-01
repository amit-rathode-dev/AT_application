
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../../services/common.service';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../../environments/environment';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Router } from '@angular/router';
import { ViewMediComponent } from '../view-medi/view-medi.component';
import { TooltipModule } from 'primeng/tooltip';
import { NoDataPipe } from '../../../../helpers/pipes/no-data.pipe';


@Component({
  selector: 'app-media-component',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule, ReusablemodulesComponent,
    DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent,
    PaginatorModule, MultiSelectModule, ViewMediComponent, TooltipModule,
    NoDataPipe
  ],
  templateUrl: './media-component.component.html',
  styleUrl: './media-component.component.css'
})
export class MediaComponentComponent {


  @ViewChild('table') table!: Table;
  @ViewChild('commontable') commontable!: CommontableComponent;
  @ViewChild('fileUpload') fileUpload!: any;
  @ViewChild('singleDocInput') singleDocInput!: ElementRef<HTMLInputElement>;
  @ViewChild('multiDocInput') multiDocInput!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput') fileInput!: ElementRef;

  mediaData: any = [];
  incomingData: any = [];
  categoryData: any = []
  mediaIncomingData: any = []
  selectedData: any = [];
  rangesData: any[] = [];
  videoLinks: string[] = [];
  presentationList: any[] = [];
  catalogueList: any[] = [];
  videoList: any[] = [];
  customerReferanceList: any[] = []
  activityList: any[] = [];
  tableData: any[] = [];
  originalData: any[] = [];
  visible: boolean = false;
  showTypeSelect: boolean = true
  showPleaseSelect: boolean = false
  activitySelected: boolean = false
  customerReferenceSelected: boolean = false;
  isvisible: boolean = false
  endPoint: string = ''

  private environment = environment.apiUrl



  mediaForm!: FormGroup;
  bannerForm!: FormGroup




  constructor(private fb: FormBuilder, private commonService: CommonService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private router: Router) {


  }

  ngOnInit() {

    this.initForm();
    this.getMediaData()

    this.mediaForm.get('media_type')?.valueChanges.subscribe((value) => {
      if (value !== 'video') {
        this.videoLinks = [];
        this.mediaForm.get('videoLink')?.reset();
      }
    });

  }

  initForm() {


    this.mediaForm = this.fb.group({

      name: ['', Validators.required],
      media_type: ['', Validators.required],
      type: ['', Validators.required],
      selected_value: [''],
      videoLink: [''],
      documents: [null],
      description: [''],
      thumbnail: [null],


    });

  }


  CreateNew() {
    this.mediaForm.reset();
    this.mediaForm.get('documents')?.reset()
    this.visible = true;
    this.initDialog();
  }

  closeDialog() {
    this.visible = false;
    this.isvisible = false
    this.mediaForm.get('documents')?.setValue(null);

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onTypeChange(event: Event): void {
    const selectedType = (event.target as HTMLSelectElement).value;



    switch (selectedType) {

      case 'product':
        this.endPoint = 'api/product/getProductList'
        this.getData();
        break;
      case 'product_range':
        this.endPoint = 'api/categories/getProducts'
        this.rangeData();
        break;
      case 'category':
        this.endPoint = 'api/categories/getCategories'
        this.getCategoriesData();
        break;
      default:
        console.warn('Unknown type selected:', selectedType);
    }
  }


  getData() {
    this.incomingData = [];
    this.selectedData = [];
    this.commonService.getAllData(this.endPoint).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status == 201) {
          this.incomingData = res.data

          if (!this.incomingData.some((item: any) => 'product_name' in item)) {
            this.selectedData = this.incomingData
              .filter((item: any) => item.isactive === true)
              .map((item: any) => ({
                id: item.id,
                name: item.name
              }));
          } else {
            // this.selectedData = this.incomingData

            this.selectedData = this.incomingData
              .filter((item: any) => item.isactive === true)
              .map((item: any) => ({
                id: item.id,
                name: item.product_name
              }));

          }


          console.log('here is the selected data', this.selectedData);



        }
      }
    })

  }

  getCategoriesData() {
    const category_type_id = 0
    this.commonService.getAllDataWithParams(this.endPoint, { category_type_id }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.categoryData = res.data
            .filter((item: any) => item.isactive === true)
            .map((category: any) => ({
              id: category.id,
              name: category.name,
              description: category.description,
              image: category.image,
              lowRange: category.lowRange,
              highRange: category.highRange,
              fuel: category.fuel
            }));


          this.selectedData = res.data
            .filter((item: any) => item.isactive === true)
            .map((category: any) => ({
              id: category.id,
              name: category.name,
            }));


        }
      }
    })
  }


  rangeData() {

    this.incomingData = [];
    this.selectedData = [];

    const queryParams = { id: 0, fuel_id: 0 }

    this.commonService.getAllDataWithParams(this.endPoint, queryParams).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.incomingData = res.data

          console.log('here ismincoming data', this.incomingData);


          let productRangeData: any[] = [];


          this.incomingData.forEach((category: any) => {
            category.fuel.forEach((fuel: any) => {
              fuel.ranges.forEach((range: any) => {
                if (range.isactive === 'true' || range.isactive === true) {
                  const rangeData = {
                    fuelId: fuel.id,
                    fuelName: fuel.name,
                    categoryName: category.category,
                    productRangeId: range.id,
                    lowRange: range.lowRange,
                    highRange: range.highRange,
                    productRangeImage: range.productRangeImage,
                    categoryId: category.id

                  };


                  productRangeData.push(rangeData);

                  this.rangesData = productRangeData;

                }
              });
            });
          });

        }
      }
    })

  }


  getMediaData() {
    const isOwn = false;

    this.commonService.postDataWithBody('api/product/getAllMedia', { isOwn }).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          const data = res.data;

          // Clear existing data
          this.presentationList = [];
          this.catalogueList = [];
          this.videoList = [];
          this.customerReferanceList = []

          // Extract and flatten presentation data
          if (Array.isArray(data.presentation)) {
            data.presentation.forEach((orgBlock: any) => {
              if (Array.isArray(orgBlock.presentation)) {
                orgBlock.presentation.forEach((item: any) => {
                  this.presentationList.push({
                    ...item,
                    org_id: orgBlock.org_id,
                    org_name: orgBlock.org_name,
                    product_name: orgBlock.product_name,
                    category: orgBlock.category

                  });
                });
              }
            });
          }



          // Extract and flatten catalogue data
          if (Array.isArray(data.catalogues)) {
            data.catalogues.forEach((orgBlock: any) => {
              if (Array.isArray(orgBlock.catalogues)) {
                orgBlock.catalogues.forEach((item: any) => {
                  this.catalogueList.push({
                    ...item,
                    org_id: orgBlock.org_id,
                    org_name: orgBlock.org_name,
                    range_from: orgBlock.range_from,
                    range_to: orgBlock.range_to
                  });
                });
              }
            });
          }

          // Extract and flatten video data
          if (Array.isArray(data.video)) {
            data.video.forEach((orgBlock: any) => {
              if (Array.isArray(orgBlock.video)) {
                orgBlock.video.forEach((item: any) => {
                  this.videoList.push({
                    ...item,
                    org_id: orgBlock.org_id,
                    org_name: orgBlock.org_name,
                    product_name: orgBlock.product_name,
                    category: orgBlock.category,
                    range_from: orgBlock.range_from,
                    range_to: orgBlock.range_to

                  });
                });
              }
            });
          }



          this.customerReferanceList.push(...(data.customer_referance ?? []));

          this.activityList.push(...(data.activity_link ?? []))


          //          if (Array.isArray(data.customer_referance)) {
          //   data.customerReferanceList.forEach((orgBlock: any) => {
          //     if (Array.isArray(orgBlock.customer_referance)) {
          //       orgBlock.customer_referance.forEach((item: any) => {
          //         this.customerReferanceList.push({
          //           ...item,
          //           org_id: orgBlock.org_id,
          //           org_name: orgBlock.org_name,
          //           product_name: orgBlock.product_name,
          //           category: orgBlock.category

          //         });
          //       });
          //     }
          //   });
          // }


          this.tableData = [... this.presentationList, ...this.catalogueList, ...this.videoList, ...this.customerReferanceList, ...this.activityList]

          this.originalData = [...this.tableData];

          console.log('her is the tableData', this.tableData);


          console.log('Presentations:', this.presentationList);
          console.log('Catalogues:', this.catalogueList);
          console.log('Videos:', this.videoList);
          console.log('customerReferanceList', this.customerReferanceList);

        }
      }
    });
  }





  // onSubmit(): void {
  //   const formData = new FormData();

  //   console.log(this.mediaForm.get('selected_value')?.value, 'here is the selected value  ');


  //   formData.append('file_name', this.mediaForm.get('name')?.value);
  //   formData.append('file_type', this.mediaForm.get('media_type')?.value);
  //   formData.append('media_type', this.mediaForm.get('type')?.value);
  //   formData.append('id', this.mediaForm.get('selected_value')?.value);

  //   if(this.mediaForm.get('media_type')?.value =='!activity'){

  //         formData.append('activity_link', 'null'); 
  //         formData.append('description:', 'null'); 
  //   }


  //   if (this.mediaForm.get('media_type')?.value === 'video') {
  //     formData.append('link', this.mediaForm.get('videoLink')?.value || '');
  //   } else {
  //     const file: File | null = this.mediaForm.get('documents')?.value;
  //     if (file) {
  //       formData.append('attachment', file);
  //     }
  //   }


  //   const orgId = localStorage.getItem('org_id') || '';
  //   const userId = localStorage.getItem('user_id') || '';

  //   formData.append('org_id', orgId);
  //   formData.append('user_id', userId);

  //   this.commonService.createData('api/product/uploadMediaForKoel', formData).subscribe({
  //     next: (res: any) => {
  //       console.log('Upload successful:', res);
  //       if (res.status == 200 || res.status == 201) {
  //         this.modelaHandler.showSuccess(res.message || 'Media uploaded Successfully')
  //         this.getMediaData()
  //         this.closeDialog()
  //       } else {
  //         this.modelaHandler.showError(res.error || 'Media Upload Problem')
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Upload error:', err);
  //     }
  //   });
  // }



  removeImage(item: any) {

  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }


  onFileInput(event: Event): void {

  }




  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.mediaForm.get('documents')?.setValue(null);
      return;
    }


    const file: File = files[0];
    this.mediaForm.get('documents')?.setValue(file);
  }


  onImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.mediaForm.get('documents')?.setValue(null);
      return;
    }

    const file: File = files[0];

    // Optionally validate MIME type explicitly
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed (e.g. PNG, JPG, JPEG, WEBP, GIF).');
      this.mediaForm.get('documents')?.setValue(null);
      input.value = ''; // Clear the file input
      return;
    }

    this.mediaForm.get('documents')?.setValue(file);
  }




  onFileUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.mediaForm.get('documents')!.setValue(null);
      return;
    }

    const mediaType = this.mediaForm.get('media_type')?.value;

    //  Allow multiple only for customer_reference; otherwise keep the first file.
    if (mediaType === 'customer_referance') {
      this.mediaForm.get('documents')!.setValue(Array.from(files));
    } else {
      this.mediaForm.get('documents')!.setValue(files[0]);            // File
    }
  }



  addVideoLink(): void {
    const linkControl = this.mediaForm.get('videoLink');
    const link = linkControl?.value?.trim();

    if (link) {
      this.videoLinks.push(link);
      linkControl?.reset();
    }
  }

  removeVideoLink(index: number): void {
    this.videoLinks.splice(index, 1);
  }


  onMediaTypeChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    if (selectedValue === 'catalogues') {
      this.showTypeSelect = false;


      this.mediaForm.get('type')?.setValue('product_range');

      this.endPoint = 'api/categories/getProducts'
      this.rangeData();
    } else if (selectedValue === 'customer_referance') {
      this.showTypeSelect = false;
      this.showPleaseSelect = false;
      this.mediaForm.get('type')?.setValue('null');

      // this.endPoint='api/categories/getProducts'
      // this.endPoint = 'api/product/getProductList'
      // this.getData();
    } else if (selectedValue === 'activity') {
      this.showTypeSelect = false;
      this.activitySelected = true;
      this.mediaForm.get('type')?.setValue('null');
    }
    else {
      this.showTypeSelect = true;
      this.mediaForm.get('type')?.reset();
    }
  }



  openDetailPopup(item: any) {

    console.log(item, 'here is the item data');

    this.videoService.openVideoPlayer(item);
    this.isvisible = true

  }


  openFile(filePath: string): void {
    if (!filePath) {
      console.warn('File path is empty or invalid.');
      return;
    }

    const isPpt = /\.(ppt|pptx)$/i.test(filePath);
    const url = filePath.startsWith('http')
      ? filePath
      : `${environment.apiUrl.replace(/\/$/, '')}/${filePath.replace(/^\//, '')}`;

    if (isPpt) {
      const encodedUrl = encodeURIComponent(url);
      window.open(`https://docs.google.com/gview?url=${encodedUrl}&embedded=true`, '_blank');
    } else {
      window.open(url, '_blank');
    }
  }

  filterMediaType(mediaType: string): void {
    console.log('orginalData', this.originalData);

    this.tableData = this.originalData.filter(item =>
      item.media_type === mediaType
    );
  }

  // filterMediaTypeCategorywise(type: string): void {
  //   console.log('orginalData', this.originalData );

  //   if(type === 'Ranges') {
  //   this.tableData = this.catalogueList.filter(item =>
  //     item.type === 'range_from'
  //   );
  //   }else if(type === 'Product') {
  //    this.tableData = this.videoList.filter(item =>
  //     item.type === 'range_from'
  //   );
  //   }

  //   this.tableData = this.originalData.filter(item =>
  //     item.media_type === type
  //   );
  // }

  filterMediaTypeCategorywise(type: string): void {
    console.log('originalData', this.originalData);

    this.tableData = this.originalData.filter(item =>
      'product_name' in item && item.media_type === type
    );
  }


  resetMediaTypeFilter(): void {
    this.tableData = [...this.originalData];
  }


  deleteMedia(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the Media. This action cannot be undone.',
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
        this.deleteMediaData(item)

        Swal.fire({
          title: 'Deleted!',
          text: 'Your Media has been deleted.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 2000,
          timerProgressBar: true
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {


      }
    });
  }

  deleteMediaData(item: any) {
    console.log(item, 'here is the new item');

    this.commonService.deleteData('api/product/deleteMedia/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.getMediaData();
          this.modelaHandler.showToast(res.message)
        } else {
          this.modelaHandler.showError(res.message)
          this.getMediaData();
        }
      }, error(err) {
        console.log(err, 'here is the error ');

      },
    })
  }


  onThumbNailUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.mediaForm.get('thumbnail')?.setValue(null);
      return;
    }

    const file: File = files[0];

    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/webp',
      'image/gif',
      'image/svg+xml'
    ];

    if (!allowedImageTypes.includes(file.type)) {
      alert('Only image files are allowed (e.g. JPG, PNG, WEBP, GIF, SVG).');
      
      this.mediaForm.get('thumbnail')?.setValue(null);
      input.value = '';
      return;
    }

    this.mediaForm.get('thumbnail')?.setValue(file);
  }


  onSubmit(): void {
    const formData = new FormData();

    formData.append('file_name', this.mediaForm.get('name')?.value);
    formData.append('file_type', this.mediaForm.get('media_type')?.value);
    formData.append('media_type', this.mediaForm.get('type')?.value);
    formData.append('id', this.mediaForm.get('selected_value')?.value);

    if (this.mediaForm.get('media_type')?.value === 'activity') {
      formData.append('link', this.mediaForm.get('videoLink')?.value);
      formData.append('description', this.mediaForm.get('description')?.value);
    }
    const mediaType = this.mediaForm.get('media_type')?.value;
    if (mediaType === 'video') {
      formData.append('link', this.mediaForm.get('videoLink')?.value || '');
    } else if (mediaType === 'customer_referance') {

      const files: File[] = this.mediaForm.get('documents')?.value || [];
      files.forEach(f => formData.append('attachment', f));
    } else {
      const file: File | null = this.mediaForm.get('documents')?.value;
      if (file) {
        formData.append('attachment', file);
      }

      if (mediaType === 'catalogues') {
        const thumbnailImage: File | null = this.mediaForm.get('thumbnail')?.value;
        if (thumbnailImage) {
          formData.append('catalogue_thumbnail', thumbnailImage);
        }
      }
    }


    formData.append('org_id', localStorage.getItem('org_id') || '');
    formData.append('user_id', localStorage.getItem('user_id') || '');


    this.commonService
      .createData('api/product/uploadMediaForKoel', formData)
      .subscribe({
        next: res => {
          if (res.status === 200 || res.status === 201) {
            this.modelaHandler.showToast(res.message || 'Media uploaded successfully');
            this.getMediaData();
            this.closeDialog();
          } else {
            this.modelaHandler.showError(res.error || 'Media upload problem');
          }
        },
        error: err => console.error('Upload error:', err),
      });
  }


  resetDocuments(): void {
    this.mediaForm.get('documents')!.setValue(null);

    if (this.singleDocInput) { this.singleDocInput.nativeElement.value = ''; }
    if (this.multiDocInput) { this.multiDocInput.nativeElement.value = ''; }
  }
  initDialog(): void {
    this.mediaForm.reset();      // resets every control
    this.resetDocuments();       // plus native inputs
  }



}
