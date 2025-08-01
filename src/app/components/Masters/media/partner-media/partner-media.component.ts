
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
import { interval, max, Subscription, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../../environments/environment';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Router } from '@angular/router';
import { ViewMediComponent } from '../view-medi/view-medi.component';
import { ChangeDetectorRef } from '@angular/core';
import { NoDataPipe } from '../../../../helpers/pipes/no-data.pipe';



@Component({
  selector: 'app-partner-media',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReactiveFormsModule,NoDataPipe, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, ViewMediComponent],
  templateUrl: './partner-media.component.html',
  styleUrl: './partner-media.component.css'
})
export class PartnerMediaComponent {


  @ViewChild('dt') table!: Table;
  @ViewChild('commontable') commontable!: CommontableComponent;
  @ViewChild('fileUpload') fileUpload!: any;
  @ViewChild('fileInput') fileInput!: ElementRef;

  mediaData: any = [];
  incomingData: any = [];
  mediaIncomingData: any = []
  selectedData: any = [];
  rangesData: any[] = [];
  videoLinks: string[] = [];
  presentationList: any[] = [];
  catalogueList: any[] = [];
  videoList: any[] = [];
  tableData: any[] = [];
  imageList: any[] = [];
  originalTableData: any[] = [];

  visible: boolean = false;
  showTypeSelect: boolean = true
  isvisible: boolean = false
  endPoint: string = ''
  globalFilterValue: string = '';



  mediaForm!: FormGroup;
  bannerForm!: FormGroup

   private pollingSub!: Subscription;

  constructor(private fb: FormBuilder, private commonService: CommonService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private router: Router, private cdr: ChangeDetectorRef) {


  }

  ngOnInit() {

    this.initForm();
    this.getMediaData()

    // this.mediaForm.get('media_type')?.valueChanges.subscribe((value) => {
    //   if (value !== 'video') {
    //     this.videoLinks = [];
    //     this.mediaForm.get('videoLink')?.reset();
    //   }
    // });
    this.closeViewMediaDialog();

    this.approvalDialogCLose()
    // this.listenForMediaUpdates()
    //     this.pollingSub = interval(10000).subscribe(() => {
    //   this.getMediaData();
    // });

    
    this.videoService.approvalStatus.subscribe((changed) => {
      if (changed) {
        this.getMediaData(); 
           this.videoService.notifyApprovalChange(false);
      }
    });
  }

  initForm() {


    this.mediaForm = this.fb.group({

      name: ['', Validators.required],
      media_type: ['', Validators.required],
      socialMediatype: [''],

      description: ['', Validators.required],
      documents: [null, Validators.required],
      // documents: [null],
      type: ['',],
      selected_value: [''],



    });

  }


  CreateNew() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.isvisible = false
    this.mediaForm.reset();
    this.resetFileInput();
  }




  getData() {
    this.incomingData = [];
    this.selectedData = [];
    this.commonService.getAllData(this.endPoint).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status == 201) {
          this.incomingData = res.data

          if (!this.incomingData.some((item: any) => 'product_name' in item)) {
            this.selectedData = this.incomingData.map((item: any) => ({
              id: item.id,
              name: item.name
            }));
          } else {
            this.selectedData = this.incomingData.map((item: any) => ({
              id: item.id,
              name: item.product_name
            }));
          }


          console.log('here is the selected data', this.selectedData);



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
              });
            });
          });

        }
      }
    })

  }


  getMediaData() {
         console.log('here called api error');
    // const isOwn = true;
    const org_id = localStorage.getItem('org_id') || '';
    const user_id = localStorage.getItem('user_id') || '';


    this.commonService.postDataWithBody('api/product/getAllMediaForPartnerByUserIdAndOrg', { org_id, user_id }).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          const data = res.data;

          this.originalTableData = data

           console.log('here called api and not fot error');
     

          this.tableData = data.sort((a: any, b: any) => b.id - a.id);
          // this.tableData = data

          this.cdr.detectChanges();

        }
      }
    });
  }





  onSubmit(): void {
    const formData = new FormData();
    const mediaType=this.mediaForm.get('media_type')?.value

  if (mediaType === 'BTL Activity') {
    // this.mediaForm.get('socialMediatype')?.setValue(null);
    this.mediaForm.get('socialMediatype')?.clearValidators();
    this.mediaForm.get('socialMediatype')?.updateValueAndValidity();
  } else {
   
    this.mediaForm.get('socialMediatype')?.setValidators([Validators.required]);
    this.mediaForm.get('socialMediatype')?.updateValueAndValidity();
  }
      if (this.mediaForm.invalid) {
    console.log('Form is invalid');
    this.mediaForm.markAllAsTouched();
    return;
  }


  
    console.log(this.mediaForm.get('selected_value')?.value, 'here is the selected value  ');


    formData.append('file_name', this.mediaForm.get('name')?.value);
    formData.append('file_type', this.mediaForm.get('media_type')?.value);
 
    formData.append('social_platform', this.mediaForm.get('socialMediatype')?.value);
    formData.append('description', this.mediaForm.get('description')?.value);
    // 1072


    const file: File | null = this.mediaForm.get('documents')?.value;
    if (file) {
      formData.append('attachment', file);
    }

    const orgId = localStorage.getItem('org_id') || '';
    const userId = localStorage.getItem('user_id') || '';

    formData.append('org_id', orgId);
    formData.append('user_id', userId);


    this.commonService.createData('api/product/uploadMediaForPartner', formData).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          console.log('Upload successful:', res);
          this.modelaHandler.showToast(res.message || 'Media uploaded successfully');
          this.getMediaData()
          this.closeDialog()
          this.videoService.notifyStatusUpdated();

       

        } else {
          this.modelaHandler.showError(res.message || 'media Upload error for the partner')
        }
      },
      error: (err) => {
        console.error('Upload error:', err);
      }
    });
  }


  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }





  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) {
      this.mediaForm.get('documents')?.setValue(null);
      return;
    }

    const file: File = files[0];
      let allowedTypes: string[];
      // Check the value of media_type from the form
      const mediaType = this.mediaForm.get('media_type')?.value;
      if (mediaType === 'BTL Activity') {
        allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
      } else {
        allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/svg+xml'
        ];
      }
      // const allowedTypes = [
      //   'application/pdf',
      //   'application/msword',
      //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      //   'application/vnd.ms-powerpoint',
      //   'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      //   'image/jpeg',
      //   'image/png',
      //   'image/gif',
      //   'image/webp',
      //   'image/bmp',
      //   'image/svg+xml'
      // ];

    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please select a valid document or image.');
      this.mediaForm.get('documents')?.setValue(null);
      return;
    }

    this.mediaForm.get('documents')?.setValue(file);
  }

  resetFileInput(): void {
    this.fileInput.nativeElement.value = '';
    this.mediaForm.get('documents')?.reset();
  }



  // onMediaTypeChange(event: Event) {
  //   const selectedValue = (event.target as HTMLSelectElement).value;

  //   if (selectedValue === 'catalogues') {
  //     this.showTypeSelect = false;


  //     this.mediaForm.get('type')?.setValue('product_range');

  //     this.endPoint = 'api/categories/getProducts'
  //     this.rangeData();
  //   } else {
  //     this.showTypeSelect = true;
  //     this.mediaForm.get('type')?.reset();
  //   }
  // }



  openDetailPopup(item: any) {

    console.log(item, 'here is the item data');

    this.videoService.openVideoPlayer(item);
    this.isvisible = true

  }



  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'reject':
      case 'rejected':
        return 'status-reject';
      case 'approved':
        return 'status-approved';
      case 'uploaded':
        return 'status-uploaded';
      default:
        return '';
    }
  }

  closeViewMediaDialog() {

    this.videoService.showPopup$.subscribe(show => {
      this.isvisible = show;
    });
  }

  parseDate(dateStr: string | undefined | null): Date | null {
    if (!dateStr) return null;

    const parts = dateStr.split('-');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts;
    return new Date(+year, +month - 1, +day);
  }


  approvalDialogCLose() {
    this.videoService.statusUpdated$.subscribe(() => {
      this.getMediaData();
      this.isvisible = false;
    });
  }

  markFileTouched(): void {
  this.mediaForm.get('documents')?.markAsTouched();
}

  listenForMediaUpdates() {
  this.videoService.statusUpdated$.subscribe(() => {
       this.isvisible = false;
    console.log('[Admin View] Media update received via BroadcastChannel');
    this.getMediaData(); 

  });
}



  filterMediaType(mediaType: string) {
    console.log(mediaType, 'media type selected');

    if (mediaType === 'banner') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'banner');
    } else if (mediaType === 'flyer') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'flyer');
    } else if (mediaType === 'BTL Activity') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'BTL Activity');
    } else {
      // Reset to all data
      this.tableData = [...this.originalTableData];
    }
  }
  
  resetFilter(mediaType: string): void {
    this.globalFilterValue=''
    this.table.clear();
    this.tableData = [...this.originalTableData];
  }



}

