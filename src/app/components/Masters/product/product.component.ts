import { CommonModule } from '@angular/common';
import { Component, model, ViewChild, CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../services/common.service';
import { every, filter, max, Observable, of, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { VideoplayerComponent } from '../../shared/services/videoplayer/videoplayer.component';
import { VideoplayerService } from '../../../services/videoplayer.service';
import { Router } from '@angular/router';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, GalleriaModule,
    ReusablemodulesComponent, TabViewModule, DropdownModule, TableModule,
    DialogModule, ReactiveFormsModule, ReusablemodulesComponent,
    PaginatorModule, MultiSelectModule, TableModule,
    VideoplayerComponent,
    NoDataPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})




export class ProductComponent {

  @ViewChild('dt') table!: Table;
  @ViewChild('fileInput') fileInput!: ElementRef;


  public environment = environment.apiUrl;

  visible: boolean = false
  variantVisible: boolean = false
  productData: any[] = [];
  rangesData: any[] = [];
  unitData: any = [] = [];
  fuelData: any[] = [];
  categoryData: any = [] = [];
  catData: any = [] = [];
  videoLinks: any[] = [];
  incomingData: any[] = [];
  newFilteredRange: any[] = []
  newFilteredRangeData: any[] = [];
  alternatorArray: any[] = [];
  tempAlternatorData: any[] = [];
  tempGensetData: any[] = [];
  tempEngineData: any[] = [];
  gensetArray: any[] = [];
  engineArray: any[] = [];
  images: any[] = [];
  allcatData: any[] = [];
  incomingDataProductData: any[] = [];
  fullProductData: any[] = []
  variantData: any[] = [];
  productWiseData: any[] = [];
  presentaion: any[] = [];
  presentationFilePairs: { file: File, name: string }[] = [];
  productImagePairs: { file: File, name: string }[] = [];
  changeProdImagePairs: { file: File, name: string }[] = [];
  videoLinkMap: { [key: number]: string[] } = {};
  editProductImageVisible: boolean = false;

  // productImageFile: File | null = null;
  // presentationFile: File | null = null;
  videos: any;
  productImageError: string | null = null;
  productImageFileName: string | null = null;
  pptFileName: string | null = null;
  videoLinkFileName: string | null = null;
  productImageFiles: File[] = [];
  presentationImageError: string | null = null;
  presentationFile: File[] = [];
  productImageNameError: string | null = null


  showDetailDialog: boolean = false;
  videoVisible: boolean = false;
  selectedItem: any = null;
  gensetArrayData: any[] = [];

  activeTabIndex: number = 0;
  selectedImage: string = '';



  productForm!: FormGroup;
  productForm2!: FormGroup;
  productFormVariantForm!: FormGroup;
  productFormVariantForm2!: FormGroup;
  addImagesForm!: FormGroup;


  step: number = 1;
  imageDialogVisible: boolean = false;
  productId!: number;



  selectedVideoList: string[] = [];
  showVideoPopup: boolean = false;
  activeVideoList: string[] = [];
  currentVideo: string = '';
  isVideoDialogOpen: boolean = false;
  isEditMode = false;
  originalGensetData: any;
  selectedWeightUnit: string = 'NA';
  selectedFueltUnit: string = 'NA';
  selectedDimesionUnit: string = 'NA';
  selectedClyndersUnit: string = 'NA';
  selectedCubicCapacityUnit: string = 'NA';
  selectedLubeOilUnit: string = 'NA';
  selctedAdblueUnit: string = 'NA';
  SelectedEfficiencyUnit: string = 'NA';
  selectedMaxtimeRatageUnit: string = 'NA';




  enableEdit() {
    this.isEditMode = true;
    this.originalGensetData = JSON.parse(JSON.stringify(this.tempGensetData));

    const unitMappings = [
      { sourceIndex: 0, field: 'weight_unit', target: 'selectedWeightUnit', compareBy: 'id' },
      { sourceIndex: 0, field: 'fuel_tank_capacity_unit', target: 'selectedFueltUnit', compareBy: 'name' },
      { sourceIndex: 0, field: 'dimension_unit', target: 'selectedDimesionUnit', compareBy: 'name' },
      { sourceIndex: 1, field: 'no_of_cylinder_unit', target: 'selectedCylindersUnit', compareBy: 'name' },
      { sourceIndex: 1, field: 'cubic_capacity_unit', target: 'selectedCubicCapacityUnit', compareBy: 'name' },
      { sourceIndex: 1, field: 'lube_oil_change_unit', target: 'selectedLubeOilUnit', compareBy: 'name' },
      { sourceIndex: 1, field: 'adblue_unit', target: 'selectedAdblueUnit', compareBy: 'name' },
      { sourceIndex: 2, field: 'alternator_unit', target: 'selectedEfficiencyUnit', compareBy: 'name' },
      { sourceIndex: 2, field: 'max_time_to_rated_unit', target: 'selectedMaxTimeRatedUnit', compareBy: 'name' },
    ];

    unitMappings.forEach(mapping => {
      const value = this.tempGensetData[mapping.sourceIndex]?.[mapping.field];
      const matchedUnit = this.unitData.find((unit: any) => unit[mapping.compareBy] === value);
      (this as any)[mapping.target] = matchedUnit ? matchedUnit.id : 'NA';

      console.log((this as any)[mapping.target], '← set for', mapping.target);
    });

  }






  saveChanges() {
    this.isEditMode = false;

    const getUnitValue = (unit: any, fallback: number) => {
      if (unit === 'NA' || unit === null || unit === undefined || unit === '') return fallback;
      return typeof unit === 'number' ? unit : Number(unit);
    };

    const payload = {
      productId: this.tempGensetData[0]?.product_id ?? null,

      genset: {
        model: this.tempGensetData[0]?.model || null,
        fuel_tank_capacity: this.tempGensetData[0]?.fuel_tank_capacity || null,
        fuel_tank_capacity_unit: this.tempGensetData[0]?.fuel_tank_capacity?
         getUnitValue(this.selectedFueltUnit, 1000):null,
        weight: this.tempGensetData[0]?.weight || null,
        weight_unit:this.tempGensetData[0]?.weight ?
         getUnitValue(this.selectedWeightUnit, 1001):null,
        length: this.tempGensetData[0]?.length || null,
        width: this.tempGensetData[0]?.width || null,
        height: this.tempGensetData[0]?.height || null,
        dimension_unit: getUnitValue(this.selectedDimesionUnit, 1002),
      },

      engine: {
        model: this.tempGensetData[1]?.model || null,
        no_of_cylinder: this.tempGensetData[1]?.no_of_cylinder || null,
        no_of_cylinder_unit:this.tempGensetData[1]?.no_of_cylinder
        ? getUnitValue(this.selectedClyndersUnit, 1003):null,
        cubic_capacity: this.tempGensetData[1]?.cubic_capacity || null,
        cubic_capacity_unit: this.tempGensetData[1]?.cubic_capacity
        ? getUnitValue(this.selectedCubicCapacityUnit, 1000)
        : null,
        lube_oil_change: this.tempGensetData[1]?.lube_oil_change || null,
        lube_oil_change_unit: this.tempGensetData[1]?.lube_oil_change? 
        getUnitValue(this.selectedLubeOilUnit, 1006):null,
        adblue: this.tempGensetData[1]?.adblue || null,
        adblue_unit:this.tempGensetData[1]?.adblue?
         getUnitValue(this.selctedAdblueUnit, 1000):null,
      },

      alternator: {
        alternator: this.tempGensetData[2]?.alternator || null,
        alternator_unit:  this.tempGensetData[2]?.alternator
        ?getUnitValue(this.SelectedEfficiencyUnit, 1004):null,
        insulation: this.tempGensetData[2]?.insulation || null,
        max_time_to_rated: this.tempGensetData[2]?.max_time_to_rated || null,
        max_time_to_rated_unit:
        this.tempGensetData[2]?.max_time_to_rated ?
        getUnitValue(this.selectedMaxtimeRatageUnit, 1005):null,
      }
    };


    this.commonService.updateData('api/product/updateProductSpecifications', payload).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.modelaHandler.showToast(res.message || 'Product updated successfully');
          this.getProductData();
          this.closeDialog();
        } else {
          this.modelaHandler.showError(res.message || 'Error updating product');
        }
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.modelaHandler.showError('Error updating product');
      }
    });



  }

  cancelEdit() {
    this.tempGensetData = JSON.parse(JSON.stringify(this.originalGensetData));
    this.isEditMode = false;
  }


  hasError(controlName: string, errorCode: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(control?.touched && control.hasError(errorCode));
  }




  constructor(private fb: FormBuilder, private videoService: VideoplayerService, private commonService: CommonService, private modelaHandler: ModealHandlerService, private router: Router) {

  }

  ngOnInit() {
    this.initForm();
    this.getProductData()
    this.getFuelData();
    this.getCategoriesData();
    this.getAllRanages();
    this.getAllUnit();
    this.getCategoryData();


    this.videoService.showPopup$.subscribe(isPopUpOpen => {
      this.showVideoPopup = isPopUpOpen;
    });
  }
  myAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(null); // Or your validation logic
    };
  }

  myAsyncValidatorFn(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return of(null); // Or your validation logic
    };



  }


  initForm() {

    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      range: ['', Validators.required],
      fuel: [''],
      description: ['', Validators.required],
      product_image: [null, Validators.required],
      presentation: [null],

      file_name: [''],
      video_name: [''],


      videoLink: [''],
      product_file_name: [''],

    })


    this.productForm2 = this.fb.group({
      modelName: ['', Validators.required],
      fuel_tank: ['', Validators.required],
      unitForFuel: ['', Validators.required],
      weight: [''],
      length: [''],
      width: [''],
      height: [''],
      gensetUnit: [''],
      dimension_unit: [''],


      engineModel: ['', Validators.required],
      cylinders: ['', Validators.required],
      unitForClynder: ['', Validators.required],
      cubeCapacity: [''],
      cubeCapacityUnit: [''],
      lube: ['', Validators.required],
      lubeQuantity: ['', Validators.required],
      adblue: [''],
      adblueUnit: [''],


      efficiency: [''],
      alternatorUnit: [''],
      alternattorVoltage: [''],
      max_time_to_rated_unit: [''],
      alternatorQuantity: [''],
      insulation: [''],

    });


    this.addImagesForm = this.fb.group({
      id: [''],
      image_names: [''],
      image: ['']
    });
  }


  onPresentationImageTouched(): void {
    const control = this.productForm.get('presentation');
    control?.markAsTouched();

    // if (!this.presentationFile) {
    //   this.presentationImageError = 'Product image is required.';
    //   control?.setErrors({ required: true });
    // }
  }

  fileRequiredValidator() {
    return (control: any) => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { required: true };
    };
  }


  createNew() {
    this.step = 1;

    this.visible = true
    this.newFilteredRangeData = []

  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }


  closeDialog() {

    this.visible = false;
    this.variantVisible = false;
    this.productForm.reset();
    this.productForm2.reset();
    this.presentationFilePairs = [];
    this.videoLinks = []
    this.productImagePairs = []
    this.productImageError = null;
    this.videoLinkFileName = null;
    this.pptFileName = null;
    this.presentationImageError = null;
    this.showDetailDialog = false
    this.productImagePairs = [];
    this.editProductImageVisible = false;
    this.addImagesForm.reset();

  }










  // onFileInput(event: any) {
  //   const input = event.target as HTMLInputElement;
  //   const files = input.files;

  //   const control = this.productForm.get('presentation');
  //   this.presentationImageError = null;

  //   if (!files || files.length === 0) {
  //     control?.setValue(null);
  //     control?.markAsTouched();
  //     control?.setErrors({ required: true });
  //     return;
  //   }

  //   const fileNameInput = this.productForm.get('file_name')?.value;

  //   if (!fileNameInput) {
  //     alert('Please enter a file name.');
  //     return;
  //   }

  //   Array.from(files).forEach((file) => {
  //     const reader = new FileReader();
  //     const img = new Image();

  //     reader.onload = (e: any) => {
  //       img.src = e.target.result;

  //       img.onload = () => {
  //         const { width, height } = img;

  //         if (width >= 175 && height >= 175 && width <= 255 && height <= 255) {
  //           this.presentationFilePairs.push({
  //             file: file,
  //             name: fileNameInput
  //           });

  //           control?.setValue(this.presentationFilePairs);
  //           control?.setErrors(null);


  //           this.productForm.patchValue({ file_name: '' });
  //           input.value = '';
  //         } else {
  //           this.presentationImageError = `Each image must be between 175x175 and 255x255 pixels. "${file.name}" is invalid.`;
  //           control?.setValue(null);
  //           control?.setErrors({ invalidSize: true });
  //         }
  //         control?.markAsTouched();
  //       };
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }


  onFileInput(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    const control = this.productForm.get('presentation');
    this.presentationImageError = null;

    if (!control) return;

    // Clear existing errors and values
    control.setValue(null);
    control.setErrors(null);


    if (!files || files.length === 0) {
      // control.setErrors({ required: true });
      // control.markAsTouched();
      // control.updateValueAndValidity();
      return;
    }

    const fileNameInput = this.productForm.get('file_name')?.value?.trim();

    // if (!fileNameInput) {
    //   this.presentationImageError = 'File Name is required.';
    //   control.setErrors({ noName: true });
    //   control.markAsTouched();
    //   control.updateValueAndValidity();
    //   return;
    // }

    const validTypes = [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];

    for (const file of Array.from(files)) {
      // if (!validTypes.includes(file.type)) {
      // this.presentationImageError = `"${file.name}" is not a valid file type. Please upload only PPT or PPTX files.`;
      //   control.setErrors({ invalidType: true });
      //   control.markAsTouched();
      //   control.updateValueAndValidity();
      //   return;
      // }


      this.presentationFilePairs.push({ file, name: fileNameInput });
    }

    control.setValue(this.presentationFilePairs);
    control.setErrors(null);
    control.markAsTouched();
    control.updateValueAndValidity();

    this.productForm.patchValue({ file_name: '' });
    input.value = '';
  }




  removePresentationFile(index: number) {
    this.presentationFilePairs.splice(index, 1);
    this.productForm.get('presentation')?.setValue(this.presentationFilePairs);
  }



  removeProductImage(index: number) {
    this.productImagePairs.splice(index, 1);
    this.productForm.get('productImage')?.setValue(this.presentationFilePairs);
  }

  triggerFileInput() {

  }



  goToNextStep() {

    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      this.step = 2;
    }

  }



  goToPreviousStep() {
    console.log('here steo 1 is callled ');

    this.step = 1;
  }




  goToNextStepForVariant() {

    this.productFormVariantForm.markAllAsTouched();

    if (this.productFormVariantForm.valid) {
      this.step = 2;
    }

  }

  getFuelData() {
    this.commonService.getAllData('api/categories/getAllFuel').subscribe({
      next: (res: any) => {

        if (res.status == 200 || res.status == 201) {
          console.log('status', res);
          this.fuelData = res.data
          console.log('status', this.fuelData);

        }
      }
    })
  }


  getCategoriesData() {
    const category_type_id = 0
    this.commonService.getAllDataWithParams('api/categories/getCategories', { category_type_id }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.categoryData = res.data.map((category: any) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
            lowRange: category.lowRange,
            highRange: category.highRange,
            fuel: category.fuel
          }));

          console.log(this.categoryData, '-------->');


          this.catData = res.data.map((category: any) => ({
            id: category.id,
            name: category.name,
            fuel: category.fuel
          }));


        }
      }
    })
  }


  getAllRanages() {

    const queryParams = { id: 0, fuel_id: 0 }

    this.commonService.getAllDataWithParams('api/categories/getProducts', queryParams).subscribe({
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
              });
            });
          });

          this.rangesData = productRangeData;

          console.log('here is the prodctdata ranges--->', this.rangesData);

        }
      }
    })
  }

  filterRangeData(selectedCategoryId: string) {
    const catId = parseInt(selectedCategoryId, 10);

    this.newFilteredRangeData = this.rangesData.filter((range: any) => range.categoryId === catId);


    if (this.newFilteredRangeData.length === 1) {
      const autoSelectId = this.newFilteredRangeData[0].productRangeId;
      this.productForm.get('range')?.setValue(autoSelectId);
    } else {
      // Reset the range field if multiple or none
      this.productForm.get('range')?.setValue('');
    }
  }






  getAllUnit() {
    this.commonService.getAllData('api/product/getAllUnit').subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.unitData = res.data
        } else {
          console.log(res.message, 'here message');

        }
      }
    })
  }


  checkFileNameEmpty(): void {

    const fileNameInput = this.productForm.get('product_file_name')?.value;
    if (!fileNameInput || fileNameInput.trim() === '') {
      this.productImageError = 'Product Image Name is required.';
    } else {
      this.productImageError = null;
    }
  }


  checkppptFileName(): void {
    console.log('Blur event fired');  // ✅ Add this to test
    const control = this.productForm.get('file_name');
    const value = control?.value;

    if (!value || value.trim() === '') {
      this.pptFileName = 'File Name is required.';
    } else {
      this.pptFileName = null;
    }

    control?.markAsTouched();
  }


  checkVideoFileNamee(): void {
    console.log('Blur event fired');  // ✅ Add this to test
    const control = this.productForm.get('file_name');
    const value = control?.value;

    if (!value || value.trim() === '') {
      this.videoLinkFileName = 'Video Link Name is required.';
    } else {
      this.videoLinkFileName = null;
    }

    control?.markAsTouched();
  }


  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const files = input.files;

  //   const control = this.productForm.get('product_image');
  //   control?.markAsTouched();

  //   if (!files || files.length === 0) {
  //     this.productImageFiles = [];
  //     this.productImageError = null;
  //     control?.setErrors({ required: true });
  //     return;
  //   }

  //   this.productImageFiles = [];
  //   this.productImageError = null;

  //   let validCount = 0;
  //   let invalidFound = false;

  //   Array.from(files).forEach((file) => {
  //     const reader = new FileReader();
  //     const img = new Image();

  //     reader.onload = (e: any) => {
  //       img.src = e.target.result;

  //       img.onload = () => {
  //         const { width, height } = img;

  //         if (width >= 175 && height >= 175 && width <= 255 && height <= 255) {
  //           validCount++;
  //           this.productImageFiles.push(file);


  //           if (validCount === files.length && !invalidFound) {
  //             control?.setErrors(null); // Clear errors
  //           }
  //         } else {
  //           this.productImageError = `"${file.name}" must be between 175x175 and 255x255 pixels.`;

  //           control?.setErrors({ invalidSize: true });
  //           invalidFound = true;
  //         }
  //       };
  //     };

  //     reader.readAsDataURL(file);
  //   });
  // }



  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    const control = this.productForm.get('product_image');

    this.productImageError = null;
    control?.setErrors(null);

    if (!files || files.length === 0) {
      control?.setValue(null);
      control?.markAsTouched();
      control?.setErrors({ required: true });
      this.productImageError = 'Product image is required.';
      return;
    }

    const fileNameInput = this.productForm.get('product_file_name')?.value;

    if (!fileNameInput || fileNameInput.trim() === '') {
      this.productImageError = 'Product Image Name is required.';
      this.productForm.get('product_image')?.setErrors({ noName: true });
      return;
    }

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = (e: any) => {
        img.src = e.target.result;

        img.onload = () => {
          const { width, height } = img;

          // if (width > 417 && height > 410 && width < 1130 && height < 817) {
          this.productImagePairs.push({ file, name: fileNameInput });

          control?.setValue(this.productImagePairs);
          control?.setErrors(null);

          this.productForm.get('product_file_name')?.reset();

          this.productImageError = null;
          this.productForm.patchValue({ file_name: '' });
          input.value = '';
          // } else {
          //   this.productImageError = `Invalid dimensions for "${file.name}". Image must be between 418x411 and 1129x816 pixels.`;
          //   control?.setValue(null);
          //   control?.setErrors({ invalidSize: true });
          // }

          control?.markAsTouched();
        };
      };

      reader.readAsDataURL(file);
    });
  }



  // addVideoLink(): void {
  //   const linkControl = this.productForm.get('videoLink');
  //   const link = linkControl?.value?.trim();

  //   const videoName=this.productForm.get('video_name')

  //   if(!videoName){
  //     return
  //   }

  //   if (link && videoName) {
  //     this.videoLinks.push(link);
  //     linkControl?.reset();
  //   }
  // }

  removeVideoLink(index: number): void {
    this.videoLinks.splice(index, 1);
  }

  addVideoLink(): void {

    const videoNameControl = this.productForm.get('video_name');
    if (!videoNameControl?.value || videoNameControl.value.trim() === '') {
      return;
    }
    const linkControl = this.productForm.get('videoLink');
    // const videoNameControl = this.productForm.get('video_name');

    const link = linkControl?.value?.trim();
    const fileName = videoNameControl?.value?.trim();

    // if (!link || !fileName) {
    //   return;
    // }


    this.videoLinks.push({
      link: link,
      file_name: fileName
    });


    linkControl?.reset();
  }



  submit() {

    // this.productForm2.markAllAsTouched();
    // if (this.productForm2.invalid) {
    //   return
    // }

    console.log('here after submit the form came here');

    const formData = new FormData();

    formData.append('product_name', this.productForm.get('productName')?.value);
    formData.append('description', this.productForm.get('description')?.value);
    formData.append('category_id', this.productForm.get('category')?.value);
    // formData.append('fuel_id', this.productForm.get('fuel')?.value);
    formData.append('product_range_id', this.productForm.get('range')?.value);


    const videoLinks: string[] = this.videoLinks;
    formData.append('videoLink', JSON.stringify(videoLinks));


    // formData.append('file_name', this.productForm.get('videoName')?.value)


    const genset = {
      model: this.productForm2.get('modelName')?.value || null,
      fuel_tank_capacity: this.productForm2.get('fuel_tank')?.value || null,
      fuel_tank_capacity_unit: +this.productForm2.get('unitForFuel')?.value || null,
      weight: this.productForm2.get('weight')?.value || null,
      weight_unit: +this.productForm2.get('gensetUnit')?.value || null,
      dimension: [
        +this.productForm2.get('length')?.value || null,
        +this.productForm2.get('height')?.value || null,
        +this.productForm2.get('width')?.value || null,
      ],
      dimension_unit: this.productForm2.get('dimension_unit')?.value || null
    };
    formData.append('genset', JSON.stringify(genset));


    const engine = {
      model: this.productForm2.get('engineModel')?.value || null,
      no_of_cylinder: this.productForm2.get('cylinders')?.value || null,
      no_of_cylinder_unit: +this.productForm2.get('unitForClynder')?.value || null,
      cubic_capacity: this.productForm2.get('cubeCapacity')?.value,
      cubic_capacity_unit: +this.productForm2.get('cubeCapacityUnit')?.value || null,
      lube_oil_change: +this.productForm2.get('lube')?.value,
      lube_oil_change_unit: +this.productForm2.get('lubeQuantity')?.value || null,
      adblue: this.productForm2.get('adblue')?.value,
      adblue_unit: +this.productForm2.get('adblueUnit')?.value || null,
    };
    formData.append('engine', JSON.stringify(engine));


    const alternator = {
      alternator: this.productForm2.get('efficiency')?.value || null,
      alternator_unit: +this.productForm2.get('alternatorUnit')?.value || null,
      insulation: this.productForm2.get('insulation')?.value || null,
      max_time_to_rated: this.productForm2.get('alternattorVoltage')?.value || null,
      max_time_to_rated_unit: +this.productForm2.get('max_time_to_rated_unit')?.value || null,
    };
    formData.append('alternator', JSON.stringify(alternator));


    const productImageNames: string[] = [];


    if (this.productImagePairs && this.productImagePairs.length > 0) {
      this.productImagePairs.forEach((item, index) => {
        formData.append(`productImage`, item.file);

        productImageNames.push(item.name);
      });
    }

    formData.append('fileNamesForProductImage', JSON.stringify(productImageNames));


    // const presentationNames: string[] = [];
    // // z //if not sending values and keys
    //     if (this.presentationFilePairs && this.presentationFilePairs.length > 0) {
    //       this.presentationFilePairs.forEach((item, index) => {
    //         if (item?.file && item?.name) {
    //           formData.append('presentation', item.file);
    //           presentationNames.push(item.name);
    //         }
    //       });

    //       // Only add names if the array has valid entries
    //       if (presentationNames.length > 0) {
    //         formData.append('presentationNames', JSON.stringify(presentationNames));
    //       }
    //     }

    const presentationNames: string[] = [];



    if (this.presentationFilePairs && this.presentationFilePairs.length > 0) {
      this.presentationFilePairs.forEach((item) => {
        formData.append('presentation', item.file); // ✅ real file
        presentationNames.push(item.name);
      });
    }

    // ✅ Always send filenames
    formData.append('fileNamesForPresentation', JSON.stringify(presentationNames));


    // ✅ Always send presentationNames
    // formData.append('fileNamesForPresentation', JSON.stringify(presentationNames));




    //bydefault
    // const presentationNames: string[] = [];
    // if (this.presentationFilePairs && this.presentationFilePairs.length > 0) {
    //   this.presentationFilePairs.forEach((item, index) => {
    //     formData.append(`presentation`, item.file);

    //     presentationNames.push(item.name);
    //   });
    // }

    // formData.append('fileNamesForPresentation', JSON.stringify(presentationNames));





    this.commonService.createData('api/product/createProduct', formData).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          console.log('here creat product successfully');
          this.closeDialog();
          this.modelaHandler.showToast(res.message || 'Product created successfully');
          this.getProductData();
          // this.modelaHandler.showSuccess(res.message, 'Product Added Successfully')

        } else {
          this.modelaHandler.showError(res.message)
        }
      }, error(err) {

        console.log(err);

      },
    })

  }



  getProductData() {
    this.commonService.getAllData('api/product/getProductList').subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status == 201) {
          this.fullProductData = res.data;
          // this.incomingDataProductData = res.data.filter((itr:any)=>{
          //   itr.isactive=true
          // })

          this.incomingDataProductData = this.fullProductData.filter((item: any) => item.isactive === true && item.is_variant === false );
          this.videoLinkMap = {};

          console.log(this.incomingDataProductData, 'here is the product data');


          this.incomingDataProductData.forEach((product: any) => {
            if (Array.isArray(product.video_link) && product.video_link.length > 0) {
              this.videoLinkMap[product.id] = product.video_link;
            }
          });
        }
      }
    })
  }


  openDetailPopup(item: any) {
    this.showDetailDialog = true;

    this.getProductDataById(item);
  }

  closeSpecificationDialog() {
    this.showDetailDialog = false;
  }



  getProductDataById(item: any) {
    this.activeTabIndex = 0;
    this.showDetailDialog = true;

    this.commonService.getDataByPathVariable('api/product/getProductById/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.productWiseData = Array.isArray(res.data) ? res.data : [res.data];
          this.variantData = this.productWiseData[0]?.variants;




          const onlyproductData = this.productWiseData?.map((item: any) => ({
            variant_name: item.variant_name,
            category_id: item.category_id,
            description: item.description,
            product_name: item.product_name,
            fuel_name: item.fuel_name,
            fuel_id: item.fuel_id,
            category_name: item.category_name,
            is_variant: item.is_variant,
            product_id: item.id,

          }));


          this.variantData.forEach(element => {
            const variantSpecification = element.specification;
            console.log(variantSpecification); // or handle as needed
          });



          const allGenVariantSpecs: any[] = [];
          const allVariantEngineSpecs: any[] = [];
          const allVariantAlternatorSpecs: any[] = [];

          this.variantData.forEach(variant => {
            const variantspec = variant.specification ?? {};
            allGenVariantSpecs.push(...(variantspec.genset ?? []));
            allVariantEngineSpecs.push(...(variantspec.engine ?? []));
            allVariantAlternatorSpecs.push(...(variantspec.alternator ?? []));
          });

          console.log(allGenVariantSpecs, allVariantEngineSpecs, allVariantAlternatorSpecs, 'variant spec');


          const specification = this.productWiseData[0]?.specification;


          const gensetSpecs = specification?.genset ?? [];
          const engineSpecs = specification?.engine ?? [];
          const alternatorSpecs = specification?.alternator ?? [];

          const allSpecs = [...gensetSpecs, ...engineSpecs, ...alternatorSpecs];

          console.log(allSpecs, 'all spec');

          this.tempGensetData = allSpecs.map((spec: any) => ({
            ...spec,
            ...onlyproductData[0],

          }))

          console.log(this.tempGensetData, 'nsdndsmnsns');



        }
      }

    })
  }


  closeDetailPopup() {
    this.showDetailDialog = false;
  }



  deleteProduct(item: any) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the Product. This action cannot be undone.',
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
        this.deleteVariantData(item)
        // Swal.fire('Deleted!', 'Your Org has been deleted.', 'success');
        Swal.fire({
          title: 'Deleted!',
          text: 'Your Product has been deleted.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 2000,
          timerProgressBar: true
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Product is safe.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 1000,
          timerProgressBar: true
        });
      }
    });


  }


  deleteVariantData(item: any) {
    const is_variant = true;
    const id = item.id
    this.commonService.updateData('api/product/deleteProduct', { id, is_variant }).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.getProductData();
          this.modelaHandler.showSuccess(res.message, 'Product Deleted Successfully')
        } else {
          this.modelaHandler.showError(res.message || 'product delete error')
        }
      }
    })
  }



  AddVariant() {

    this.step = 1;
    this.variantVisible = true
  }


  onProductChange(event: any) {
    const productId = event.target.value;

    const selectedProduct = this.incomingDataProductData.find(p => p.id == productId);

    if (selectedProduct) {


      this.productFormVariantForm.patchValue({


        category: selectedProduct?.category_name || '',
        fuel: selectedProduct?.fuel_name || '',
        range: selectedProduct?.product_range_id || '',
        description: selectedProduct?.description || '',
        productName: selectedProduct?.product_name || '',

      });
    } else {

      this.productForm.patchValue({
        category: '',
        fuel: '',
        range: '',
        description: ''

      });
    }



  }


  getCategoryNameById(id: number | string): string | undefined {
    return this.catData.find((cat: { id: string | number; }) => cat.id === id)?.name;
  }

  getFuelNameById(id: number | string): string | undefined {
    return this.fuelData.find(fuel => fuel.id === id)?.name;
  }


  onFileUpload(event: FileUploadHandlerEvent) {

    const files = event.files;
    const control = this.productForm.get('presentation');
    this.presentationImageError = null;
    this.presentationFile = [];

    if (!files || files.length === 0) {
      control?.setValue(null);
      control?.markAsTouched();
      control?.setErrors({ required: true });
      return;
    }
  }

  selectedImages: any[] = [];

  openImageDialog(productId: number): void {
    console.log(this.incomingDataProductData, 'gbsgnsgns');

    const product = this.incomingDataProductData.find(p => p.id === productId);
    console.log(product, 'here is the product data');

    if (product && product.product_image?.length) {
      this.selectedImages = product.product_image;
      this.images = this.selectedImages.map((img: { product_image: any; }) => ({
        itemImageSrc: img.product_image,
        thumbnailImageSrc: img.product_image,
        alt: 'Product Image',
        title: 'Product'
      }));

      console.log('here is the selected image', this.selectedImages);

      this.imageDialogVisible = true;
    } else {
      this.selectedImages = [];
      this.imageDialogVisible = false;
    }
  }


  closeImageDialog() {

    this.imageDialogVisible = false;
    this.selectedImages = [];

  }

  presentationDialogVisible: boolean = false;
  selectedPresentations: any[] = [];

  openPresentationDialog(presentations: any[]) {
    this.selectedPresentations = presentations;
    console.log('here is the selected presentation', this.selectedPresentations);

    this.presentationDialogVisible = true;
  }

  closePresentationDialog() {
    this.presentationDialogVisible = false
  }


  onProductClick(productId: number): void {
    const videoList = this.videoLinkMap[productId] || [];

    if (videoList.length === 0) {
      console.warn('No videos for this product');
      return;
    }

    this.selectedVideoList = videoList;
    this.selectedVideoList = videoList;
    this.videoService.openVideoPlayer(this.selectedVideoList);
    this.showVideoPopup = true;

    // this.router.navigate(['/video']);
  }

  downloadFile(item: any) {

    const fileUrl = item.product_image;

    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = item.file_name || 'presentation-file';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('File URL not available.');
    }
  }


  closeVideoPopup() {
    this.showVideoPopup = false;
  }

  selectedVariant: any;
  variantDialogVisible: boolean = false;
  activeTab: string = 'genset';
  openVariantDialog(variant: any): void {
    this.selectedVariant = variant;
    this.activeTab = 'genset';
    this.variantDialogVisible = true;
  }

  activeTabb: string = 'genset';

  setActive(tab: string): void {
    this.activeTab = tab;
  }


  getCategoryData() {
    this.commonService.getAllData('api/categories/getCategoriesByFuel').subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.allcatData = res.data.filter((itr: any) => {
            return itr.isactive === true;
          });

          console.log(this.allcatData, 'here is cat data');

        }
      }
    })
  }



  submittedImages: { name: string, file: File }[] = [];
  editProductImage(item: any) {
    this.productId = item.id;
    this.editProductImageVisible = true;
  }
  addImages(): void {
    const name = this.addImagesForm.get('image_names')?.value;

    if (!name || !this.selectedUploadableImage) {
      alert('Please enter name and select image.');
      return;
    }

    this.changeProdImagePairs.push({ name, file: this.selectedUploadableImage });

    // Reset input fields
    this.addImagesForm.reset();
    this.selectedUploadableImage = null;

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }



  selectedUploadableImage: File | null = null;


  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedUploadableImage = input.files[0];
      this.addImages();
    }
  }

  //   removeImage(index: number): void {
  //   this.selectedUploadableImage.splice(index, 1);
  // }

  submitImages(): void {


    const formData = new FormData();

    const fileNames: string[] = [];

    this.changeProdImagePairs.forEach((item) => {
      formData.append('attachment', item.file);
      fileNames.push(item.name);
    });

    formData.append('fileNames', JSON.stringify(fileNames));


    console.log('Sending FormData to backend...');

    formData.append('product_id', String(this.productId));


    this.commonService.updateData('api/product/uploadImagesForProduct', formData).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.modelaHandler.showToast(res.message);
          this.editProductImageVisible = false;
          this.closeDialog()
          this.changeProdImagePairs = [];
          this.getProductData();

        } else {
          this.modelaHandler.showError(res.message || 'Error updating product image');
        }
      },
      error: () => {
        this.modelaHandler.showError('Server error during upload');
      }
    });
  }




} 
