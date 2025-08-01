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
import { ImageViewComponent } from '../image-view/image-view.component';

export function rangeValidator(fromKey: string, toKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromCtrl = group.get(fromKey);
    const toCtrl = group.get(toKey);

    const from = fromCtrl?.value;
    const to = toCtrl?.value;

    if (from === null || to === null || from === '' || to === '') {

      return null;
    }

    if (to <= from) {
      toCtrl?.setErrors({ ...(toCtrl.errors || {}), rangeInvalid: true });
    } else {

      if (toCtrl?.hasError('rangeInvalid')) {
        const errors = { ...(toCtrl.errors || {}) };
        delete errors['rangeInvalid'];
        if (Object.keys(errors).length === 0) {
          toCtrl.setErrors(null);
        } else {
          toCtrl.setErrors(errors);
        }
      }
    }

    return null;
  };
}




@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, CategoryDetailsComponent, ImageViewComponent],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {




  @ViewChild('dt') table!: Table;
  categoryData: any[] = []
  selectedImages: any[] = []
  fuelData: any = [] = []
  catData: any = [] = []
  editData: any = [] = []
  uploadedImageUrl: string = '';
  productRangeImageError: string = '';
  productrangetouchError: string = '';
  productFromRangeErrorVar: string = '';
  productToRangeErrorVar: string = '';
  productRangeFromErrorMessage: string = ''
  productRangeToErrorMessage: string = '';
  product_range: any[] = [];
  // product_range_data: any[]=[];

  visible: boolean = false
  isEdit: boolean = false
  UserValidate: boolean = false
  formSubmitted: boolean = false
  isnewProductRangeVisible: boolean = false
  isImageView: boolean = false;
  categoryForm!: FormGroup
  productRangeForm!: FormGroup
  editCategoryForm!: FormGroup
    addImagesForm!: FormGroup;
  selectedProductRangeFile: File | null = null;
  newAddedProductRangeFile: File | null = null;
  categoryImageFile: File | null = null;
  productImageFile: File | null = null;
  categoryImageError: string | null = null;
  productimageError: string | null = null;
  item: any;
  ismanuallyCleared: boolean = true
  editingIndex: number | null = null;
  isreplacingImage: boolean = false
  unavalableMessage = "NA"
  items: any[] = [];
  catDetailsView: boolean = false;
  incomingCatTypeData: any = [];
  associatedData: any = [];


  public environment = environment.apiUrl;


  ngOnInit() {
    this.getCategoriesData();
    this.getFuelData();
    this.initForm()
    this.initializeFormArray();
    this.getCategoryTypeData();

    // this.categoryForm.get('range_from')?.valueChanges.subscribe(value => {
    //   const toControl = this.categoryForm.get('range_to');
    //   if (value && Number(value) > 0) {
    //     toControl?.enable();
    //   } else {
    //     toControl?.disable();
    //     toControl?.reset();
    //   }
    // });

    this.categoryForm.get('range_from')?.valueChanges.subscribe((value) => {
      const rangeToControl = this.categoryForm.get('range_to');
      if (value) {
        rangeToControl?.enable();
      } else {
        rangeToControl?.disable();
        rangeToControl?.reset();
      }
    });



    if (!this.categoryForm.get('range_from')?.value) {
      this.categoryForm.get('range_to')?.disable();
    }

    this.productRangeForm.get('range_from')?.valueChanges.subscribe(value => {
      const rangeToControl = this.productRangeForm.get('range_to');

      if (value) {
        rangeToControl?.enable({ emitEvent: false });
      } else {
        rangeToControl?.disable({ emitEvent: false });
        rangeToControl?.reset(); // Optional: reset 'to' field when 'from' is cleared
      }
    });



    this.editCategoryForm.get('range_from')?.valueChanges.subscribe(value => {
      const rangeToControl = this.editCategoryForm.get('range_to');

      if (value) {
        rangeToControl?.enable({ emitEvent: false });
      } else {
        rangeToControl?.disable({ emitEvent: false });
        rangeToControl?.reset();
      }
    });


    this.catDataShare.showPopup$.subscribe(show => {
      this.catDetailsView = show;
      this.isImageView = show;

    });








  }


  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService, private sanitizer: DomSanitizer, private catDataShare: VideoplayerService) {

  }


  initForm() {

    this.categoryForm = this.fb.group({

      range_from: ['', Validators.required],
      range_to: [{ value: '', disabled: true }, Validators.required],

      category_name: ['', Validators.required],
      fuel_id: ['', Validators.required],
      description: ['', Validators.required],

      prf: [''],

      categoryType: ['', Validators.required],
      category_image: [''],

    }, { validators: rangeValidator('range_from', 'range_to') });



    this.productRangeForm = this.fb.group({

      category_id: ['', Validators.required],
      fuel_id: ['', Validators.required],
      range_from: ['', Validators.required],
      range_to: [{ value: '', disabled: true }, Validators.required],
      product_image: ['', Validators.required]


    }, { validators: rangeValidator('range_from', 'range_to') });




    this.editCategoryForm = this.fb.group({

      // editrange_from: ['',Validators.required],
      // editrange_to: [{ value: '', disabled: true }, Validators.required],
      range_from: ['', Validators.required],
      range_to: [{ value: '', disabled: true }, Validators.required],

      editcategory_name: ['', Validators.required],
      editfuel_id: [''],
      editdescription: ['', Validators.required],

      editprf: [''],

      editcategory_image: [''],
      product_range_data: this.fb.array([])
    }, { validators: rangeValidator('range_from', 'range_to') });



     this.addImagesForm = this.fb.group({
      id: [''],
      image_names: [''],
      image: ['']
    });


  }

  onCategoryImageTouched(): void {
    const control = this.categoryForm.get('category_image');
    control?.markAsTouched();


    if (!this.categoryImageFile) {
      this.categoryImageError = 'Category image is required.';
      control?.setErrors({ required: true });
    }
  }


  onProductImageTouched(): void {
    const control = this.productRangeForm.get('product_image');
    control?.markAsTouched();

    if (!this.productImageFile) {
      this.productrangetouchError = 'Product Range Image is required.';
      control?.setErrors({ required: true });
    } else {
      this.productrangetouchError = '';
      control?.setErrors(null);
    }
  }






  onRangeFromChange(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue) {
      this.productRangeFromErrorMessage = '';
      this.productRangeToErrorMessage = '';
    }
  }

  onRangeToChange(event: Event): void {
    const inputValueTo = (event.target as HTMLInputElement).value;
    const rangeFrom = this.categoryForm.get('range_from')?.value;
    if (inputValueTo) {
      this.productRangeToErrorMessage = ''

      const toValue = Number(inputValueTo);
      const fromValue = Number(rangeFrom);

      if (!isNaN(toValue) && !isNaN(fromValue) && toValue <= fromValue) {
        this.productRangeToErrorMessage = 'To value should be greater than From value';
      }
    }
  }


  addProductRange() {
    this.ismanuallyCleared = false
    this.categoryForm.get('range_from')?.markAsTouched();
    this.categoryForm.get('range_to')?.markAsTouched();
    this.categoryForm.get('prf')?.markAsTouched();

    if (!this.selectedProductRangeFile) {

      this.selectedProductRangeFile = null;
      this.productRangeImageError = 'Product Range Image is required.';

    }

    const range_from = this.categoryForm.get('range_from')?.value;
    const range_to = this.categoryForm.get('range_to')?.value;

    // const rangeError = this.categoryForm.errors?.['rangeInvalid'];

    const fromNumber = Number(range_from);
    const toNumber = Number(range_to);

    if (fromNumber && toNumber && toNumber <= fromNumber) {
      this.productRangeToErrorMessage = 'To value must be greater than From value';
      return;
    }


    // if (!range_from) {
    //   this.productRangeFromErrorMessage = 'From range required'
    // }
    if (!range_to) {
      this.productRangeToErrorMessage = 'To range is required'
    }


    if (range_from && range_to && this.selectedProductRangeFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreviewUrl = reader.result as string;
        this.product_range.push({
          range_from,
          range_to,

          preview: imagePreviewUrl,
          temp: this.selectedProductRangeFile,
        });

        // Clear
        // this.categoryForm.patchValue({ range_from: '', range_to: '', prf:'' });
        this.categoryForm.get('range_from')?.reset();
        this.categoryForm.get('range_to')?.reset();
        this.categoryForm.get('prf')?.reset();

        this.selectedProductRangeFile = null;
      };
      reader.readAsDataURL(this.selectedProductRangeFile);
    }
  }


  onFileSelected(event: any, fileInput: HTMLInputElement): void {
    const file = event.target.files[0];

    if (!file) {
      this.selectedProductRangeFile = null;
      this.productRangeImageError = 'Product Range Image is required.';
      this.categoryForm.get('prf')?.setErrors({ required: true });
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        // if (this.app_Type === 'Web') {
        //     minWidth = 1100;
        //     maxWidth = 1300;
        //     minHeight = 300;
        //     maxHeight = 500;
        //   } else if (this.app_Type === 'Mobile') {
        //     minWidth = 1280;
        //     maxWidth = 1380;
        //     minHeight = 720;
        //     maxHeight = 820;

        // if (width > 417 && height > 410 && width < 1130 && height < 817) {
        this.selectedProductRangeFile = file;
        this.productRangeImageError = '';

        this.categoryForm.patchValue({
          product_range_file: file
        });

        this.categoryForm.get('prf')?.setErrors(null);
        this.categoryForm.get('prf')?.updateValueAndValidity();
        // }
        //  else {
        //   this.selectedProductRangeFile = null;
        //   this.productRangeImageError = 'Image dimensions must be greater than 417(width)410(height) and less than 1130(width)817(height) pixels.';

        //   fileInput.value = '';
        //   this.categoryForm.get('prf')?.setErrors({ invalidSize: true });
        // }

        this.categoryForm.get('prf')?.markAsTouched();
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }



  // onCategoryImageSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.categoryImageFile = file;

  // } else {
  //   this.categoryImageFile = null;
  //     this.categoryImageError = 'Category image is required.';

  // }
  // }


  onCategoryImageSelected(event: any, fileInput: HTMLInputElement): void {
    const file = event.target.files[0];

    console.log(event.target.files, 'here is the taget files ---->');

    if (!file) {
      this.categoryImageFile = null;
      this.categoryImageError = 'Category image is required.';
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;


        //  if (width > 417 && height > 410 && width < 1130 && height < 817) {
        this.categoryImageFile = file;
        this.categoryImageError = '';
        this.categoryForm.get('category_image')?.setErrors(null);
        // }
        //  else {
        //   this.categoryImageFile = null;
        //   this.categoryImageError = 'Image should be greater than 150(width)x135(height) and less than 330(Width)x215(height).';

        //   this.categoryForm.get('category_image')?.setErrors({ invalidSize: true });

        //   fileInput.value = '';
        // }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }




  // onFileSelected(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       this.uploadedImageUrl = reader.result as string;

  //       // After the image is loaded, add to productRanges
  //       const from = this.categoryForm.get('from')?.value;
  //       const to = this.categoryForm.get('to')?.value;

  //       if (from && to) {
  //         this.productRanges.push({ from, to, image: this.uploadedImageUrl });

  //         // Reset form fields
  //         this.categoryForm.patchValue({ from: '', to: '' });
  //         this.uploadedImageUrl = '';
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }



  removeRange(index: number) {
    this.product_range.splice(index, 1);
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.uploadedImageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }

  CreateNew() {
    this.visible = true
  }
  AddNewProduct() {
    this.isnewProductRangeVisible = true
  }






  removeImage(index: number) {
    this.selectedImages.splice(index, 1);

  }

  submitForm() {

    this.formSubmitted = true

    console.log(this.categoryForm.value, '--------------->');

    this.categoryForm.get('range_from')?.clearValidators();
    this.categoryForm.get('range_to')?.clearValidators();


    this.categoryForm.get('range_from')?.updateValueAndValidity();
    this.categoryForm.get('range_to')?.updateValueAndValidity();



    this.UserValidate = true


    if (this.categoryForm.valid && this.product_range.length > 0 && this.categoryImageFile) {
      const formData = new FormData();

      formData.append('category_name', this.categoryForm.get('category_name')?.value);
      formData.append('category_type_id', this.categoryForm.get('categoryType')?.value)
      formData.append('fuel_id', this.categoryForm.get('fuel_id')?.value);
      formData.append('description', this.categoryForm.get('description')?.value);
      formData.append('attachment', this.categoryImageFile);


      const productRangeArray = this.product_range.map(range => ({
        range_from: range.range_from,
        range_to: range.range_to
      }));

      formData.append('product_range', JSON.stringify(productRangeArray));

      this.product_range.forEach(range => {
        formData.append('product_range_image', range.temp);
        // formData.append('product_range', range.temp);
      });


      this.commonService.createData('api/categories/addCategories', formData).subscribe({
        next: (res: any) => {
          console.log('Form submitted successfully!', res);

          if (res.status == 201 || res.status == 200) {
            this.modalHandler.showToast(res.message || 'Category Added successfully', 'success');
            this.closeDialog();
            this.getCategoriesData();

            this.categoryForm.reset()

          } else {
            this.modalHandler.showError(res.message || 'Category Added gone wrong')
          }

          this.product_range = [];
          this.categoryImageFile = null;
        },
        error: (err: any) => {
          this.modalHandler.showError(err.message)
          this.closeDialog();
          console.error('Error submitting form:', err);
        }
      });
    } else {
      console.warn('Form is invalid or missing required data');
    }
  }


  closeDialog() {
    this.visible = false
    this.isnewProductRangeVisible = false
    this.categoryForm.reset()
    this.product_range = []
    this.productRangeToErrorMessage = ''
    this.productRangeImageError = ''
    this.productRangeFromErrorMessage = ''
    this.categoryImageError = ''

    this.categoryImageFile = null;

    this.categoryForm.reset();
    this.productRangeForm.reset();
    this.categoryForm.markAsPristine();
    this.categoryForm.markAsUntouched();
    this.formSubmitted = false
    this.isEdit = false
    this.editCategoryForm.reset();

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


          this.categoryData = res.data
            .filter((category: any) => category.isactive === true)

            .map((category: any) => ({
              id: category.id,
              name: category.name,
              description: category.description,
              category_type_name: category.category_name,
              category_type_id: category.category_type_id,
              category_type_image: category.category_type_image,
              image: category.image,
              lowRange: category.lowRange,
              highRange: category.highRange,
              fuel: category.fuel,
              is_active: category.isactive,
            }));

          console.log(this.categoryData, 'here is the vategory data');



          this.catData = res.data.map((category: any) => ({
            id: category.id,
            name: category.name,
          }));


        }
      }
    })
  }


  editCategory(item: any) {

    this.getProductRangeData(item)
    console.log('here is the edit category---_----->', item);
    this.isEdit = true;

    console.log(item, 'item');


  }



  get product_range_data(): FormArray {
    return this.editCategoryForm.get('product_range_data') as FormArray;
  }

  removeProductRange(index: number) {
    this.product_range_data.removeAt(index);
  }


  getProductRangeData(item: any) {
    const ids = [item.id];
    console.log(ids, 'here are the ids');

    this.commonService.getAllDataIdwise('api/categories/getProducts', ids).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.editData = res.data
          console.log('here is the edit data--->', this.editData);

          let matchedFuelId: number | null = null;

          this.editData.forEach((dataItem: any) => {
            dataItem.fuel.forEach((fuelItem: any) => {
              const match = this.fuelData.find((fd: any) => fd.id === fuelItem.id);
              if (match && !matchedFuelId) {
                matchedFuelId = match.id;
              }
            });
          });


          this.editCategoryForm.patchValue({
            editcategory_name: item.name || '',
            editdescription: item.description || '',
            editprf: '',
            editfuel_id: matchedFuelId || null,
            editcategory_image: item.categoryimage

          });

          const fuelArray = this.editCategoryForm.get('product_range_data') as FormArray;
          fuelArray.clear();

          this.editData.forEach((item: any) => {

            item.fuel.forEach((fuelItem: any) => {

              fuelItem.ranges.forEach((range: any) => {

                const safeImageUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(range.productRangeImage || '');

                fuelArray.push(this.fb.group({
                  range_from: [range.lowRange || ''],
                  range_to: [range.highRange || ''],
                  preview: [safeImageUrl]

                }));
              });
            });
          });
        }
      }
    })
  }



  addNewProductRange() {
    console.log('here function is callled');

    const from_range = this.editCategoryForm.get('range_from')?.value;
    const to_range = this.editCategoryForm.get('range_to')?.value;
    const range_from = Number(from_range);
    const range_to = Number(to_range);

    console.log('here frommnumber and to number isn', range_from, '', range_to, '', this.newAddedProductRangeFile);


    if (range_from && range_to && this.newAddedProductRangeFile) {
      console.log('here got in true condition ');
      const reader = new FileReader();
      reader.onload = () => {
        const imagePreviewUrl = reader.result as string;

        const productRangeFormGroup = this.fb.group({
          range_from: [range_from],
          range_to: [range_to],
          preview: [imagePreviewUrl],
          temp: [this.newAddedProductRangeFile]
        });

        (this.editCategoryForm.get('product_range_data') as FormArray).push(productRangeFormGroup);


        this.newAddedProductRangeFile = null;
      };
      reader.readAsDataURL(this.newAddedProductRangeFile);
    }

  }


  onFileEdited(event: any) {
    const file = event.target.files[0];

    console.log(file, 'new file ');
    if (!file) {
      console.log('its confirm ');

      return
    }

    const img = new Image();
    const filereader = new FileReader();

    filereader.onload = (e: any) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        if (width > 150 && height > 135 && width < 330 && height < 215) {
          this.newAddedProductRangeFile = file;

          console.log('here rerererererer', this.newAddedProductRangeFile);


          this.editCategoryForm.patchValue({
            product_range_file: file
          });
        } else {

          console.log('here got in else part condition got false');

          this.newAddedProductRangeFile = null;

          this.editCategoryForm.get('editprf')?.setErrors({ invalidSize: true });
        }

        this.editCategoryForm.get('editprf')?.markAllAsTouched();

      }

      console.log('here is the fifle reader-->', filereader);


      img.src = e.target.result;
    };
    filereader.readAsDataURL(file);
  }





  getFuelNameById(id: number | string): string {
    const fuel = this.fuelData.find((f: { id: string | number; }) => f.id === id);
    return fuel ? fuel.name : '';
  }



  editProductrangesData(index: number): void {

    this.editingIndex = this.editingIndex === index ? null : index;
    this.isreplacingImage = true;
  }



  initializeFormArray(): void {
    this.product_range_data.clear();
    this.items.forEach(item => {
      this.product_range_data.push(
        this.fb.group({
          range_from: [item.range_from || null, Validators.required],
          range_to: [item.range_to || null, Validators.required],
          prf: [null],
          preview: [item.preview || null]
        })
      );
    });
  }


  onFilereplacedEdited(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.product_range_data.at(index).get('prf')?.setValue(file);
      const previewUrl = URL.createObjectURL(file);
      this.product_range_data.at(index).patchValue({ preview: previewUrl });
      this.items[index].preview = previewUrl;
      console.log('Selected file for row', index, ':', file);
    }
  }


  onCategoryClick(item: any) {

    console.log(item, 'here is the item clicked');

    const categoryTempData = this.categoryData.find((cat: any) => cat.id === item.id);
    if (categoryTempData) {
      this.catDataShare.openVideoPlayer(categoryTempData)
    }
  }

  openDescription(item: any) {

    this.catDataShare.openVideoPlayer(item);
    this.catDetailsView = true
    this.isImageView = false;

  }

  closeImageDialog() {
    this.catDetailsView = false
    this.isImageView = false;
    this.catDataShare.closeVideoPlayer();
  }



  getCategoryTypeData() {
    this.commonService.getAllData('api/categories/getAllCategoriesType').subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status == 201) {
          this.incomingCatTypeData = res.data
          console.log(this.incomingCatTypeData, 'here is incoming category Type data');

        }
      }
    })
  }


  onImageClick(item: any, categoryTypeImage: boolean) {
    console.log('Image clicked:', item);
    this.catDataShare.shareImages(item, categoryTypeImage);
    this.isImageView = true;
    this.catDetailsView = false;
  }



  
  deleteCategory(item: any) {

    console.log(item, 'here checkun g id');

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete the Product Range. This action cannot be undone.',
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

        this.checkAndDeleteCategory(item)
   
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Category is safe ',
          icon: 'info',
          showConfirmButton: true,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            confirmButton: 'swal2-confirm-custom'
          }
        });
      }
    });
  }


    checkAndDeleteCategory(item: any) {
    const data_type = 'categories';
    const category_id = item.id;

    this.commonService.postDataWithBody('api/categories/checkRelation', { data_type, category_id }).subscribe({
      next: (res: any) => {
        if (res.status == 400) {
          this.deleteCategoryData(item);
        } else if (res.status == 200) {
          this.associatedData = res.data.categories
          const associatedNames = this.associatedData.map((d: any) => d.product_range_id).join(', ');
          const associatedProductNames = this.associatedData.map((d: any) => d.product_name).join(', ');
          Swal.fire({
            title: 'Deletion Alert',
            html: `The following Categories are associated with this Ranges Id : <strong>${associatedNames} \</strong>.<br><br>Please remove these associations from Ranges before deleting.`,
            icon: 'warning',
            showConfirmButton: true,
            // timer: 5000,
            timerProgressBar: true,
            customClass: {
              confirmButton: 'swal2-confirm-custom'
            }
          });

        }
      }
    })
  }


  deleteCategoryData(item: any) {

    console.log(item.id, 'here item id is ');

    this.commonService.deleteData('api/categories/deleteCategory/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.getCategoriesData();
          this.modalHandler.showToast(res.message || 'Category Deleted successfully', 'success');

        } else {
          this.modalHandler.showError(res['message']);
        }
      }
    })
  }







  
  changeProdImagePairs: { file: File, name: string }[] = [];
  editProductImageVisible: boolean = false;


  selectedUploadableImage: File | null = null;
  submittedImages: { name: string, file: File }[] = [];
  categoryId!: number;

  editProductImage(item: any) {
    console.log('Edit Product Image clicked for item:', item);
    this.categoryId = item.id;
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
  }


  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedUploadableImage = input.files[0];
      this.addImages()
    }
  }



submitImages(): void {


    const formData = new FormData();

    const fileNames: string[] = [];

    this.changeProdImagePairs.forEach((item) => {
      formData.append('attachment', item.file);
      fileNames.push(item.name);
    });

    formData.append('fileNames', JSON.stringify(fileNames));


    console.log('Sending FormData to backend...');

    formData.append('id', String(this.categoryId));


    this.commonService.updateData('api/categories/uploadImagesForCatagory', formData).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.modalHandler.showToast(res.message);
          this.editProductImageVisible = false;
          this.closeDialog()
          this.getCategoriesData
      
          this.changeProdImagePairs = [];
     

        } else {
          this.modalHandler.showError(res.message || 'Error updating product image');
        }
      },
      error: () => {
        this.modalHandler.showError('Server error during upload');
      }
    });
  }




}



