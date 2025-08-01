import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../services/common.service';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { ToastModule } from 'primeng/toast';
import { SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';



export function rangeValidator(fromKey: string, toKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const fromCtrl = group.get(fromKey);
    const toCtrl = group.get(toKey);

    const from = fromCtrl?.value;
    const to = toCtrl?.value;

    if (from === null || to === null || from === '' || to === '') {

      return null;
    }

    if (+from >= +to) {
      return { rangeInvalid: true };
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
  selector: 'app-product-ranges',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, GalleriaModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule],
  templateUrl: './product-ranges.component.html',
  styleUrl: './product-ranges.component.css'
})
export class ProductRangesComponent {


  @ViewChild('dt') table!: Table;
   @ViewChild('fileInput') fileInput!: ElementRef;

  productRangeData: any[] = []
  fuelData: any = [] = []
  incomingData: any = [] = [];
  catData: any = [] = []
  categoryData: any[] = []
  rangesData: any[] = [];
  editableData: any[] = [];
  filteredRanges: any[] = [];
  associatedData: any[] = [];

  isnewProductRangeVisible: boolean = false
  isProductImageReplace: boolean = false;
  isVisible: boolean = false
  isEditMode: boolean = false
  isNewProductImageSelected: boolean = false;
  productRangeForm!: FormGroup;
  createproductRangeForm!: FormGroup;
  addImagesForm!: FormGroup;
  productimageError: string | null = null;
  productImageFile: File | null = null;
  selectedRangeIndex: number | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  produtCatalogImageError: string | null = null;
  presentationFilePairs: { file: File, name: string }[] = [];
  productCatalogPairs: { file: File, name: string }[] = [];
  productCatalog: { file: File, name: string }[] = [];

  selectedImageItems: any;

  productrangetouchError: string = '';

  sanitizer: any;
  tableData: any[] = [];
  imageDialogVisible: boolean = false;


  public environment = environment.apiUrl;

  ngOnInit() {

    this.initForm();
    this.getFuelData();
    this.getCategoriesData();
    this.getAllRanages();



    this.createproductRangeForm.get('range_from')?.valueChanges.subscribe(value => {
      const rangeToControl = this.createproductRangeForm.get('range_to');

      if (value) {
        rangeToControl?.enable({ emitEvent: false });
      } else {
        rangeToControl?.disable({ emitEvent: false });
        rangeToControl?.reset();
      }
    });


    if (this.isEditMode && this.imageUrl) {
      this.imagePreviewUrl = this.imageUrl;
    }


  }

  initForm() {

    this.addImagesForm = this.fb.group({
      id: [''],
      image_names: [''],
      image: ['']
    });


    this.createproductRangeForm = this.fb.group({

      projectRangeid: [''],
      category_id: ['', Validators.required],
      fuel_id: ['', Validators.required],
      range_from: ['', Validators.required],
      range_to: [{ value: '', disabled: true }, Validators.required],
      product_image: ['', Validators.required],
      file_name: [''],
      presentation: [''],



    }, { validators: rangeValidator('range_from', 'range_to') });




    this.productRangeForm = this.fb.group({

      projectRangeid: [''],
      category_id: ['', Validators.required],
      fuel_id: ['', Validators.required],
      range_from: ['', Validators.required],
      range_to: [Validators.required],
      product_image: ['', Validators.required]


    }, { validators: rangeValidator('range_from', 'range_to') });



  }




  constructor(private fb: FormBuilder, private commonService: CommonService, private modalHandler: ModealHandlerService) {

  }


  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }


  CreateNew() {
    this.isVisible = true
    this.isEditMode = false

  }


  closeDialog() {
    this.isnewProductRangeVisible = false
    this.isVisible = false
    this.createproductRangeForm.reset();
    this.createproductRangeForm.get('category_id')?.enable();
    this.createproductRangeForm.get('fuel_id')?.enable();

    this.createproductRangeForm.patchValue({
      category_id: '',
      fuel_id: '',
    });

    this.productCatalog = []

    this.productRangeForm.reset();

    this.imageDialogVisible = false

  }





  addProcutRange() {

    this.createproductRangeForm.markAllAsTouched();

    if (this.createproductRangeForm.invalid) {
      return;
    }


    const formData = new FormData();
    formData.append('category_id', this.createproductRangeForm.get('category_id')?.value);
    formData.append('fuel_id', this.createproductRangeForm.get('fuel_id')?.value);
    formData.append('range_from', this.createproductRangeForm.get('range_from')?.value);
    formData.append('range_to', this.createproductRangeForm.get('range_to')?.value);

    if (this.productImageFile) {

      console.log('here productrange file ', this.productImageFile);

      formData.append('attachment', this.productImageFile, this.productImageFile.name);
    } else {

      console.log('No image selected.');
    }




    const productCatalogsPairs: string[] = [];
    if (this.productCatalog && this.productCatalog.length > 0) {
      this.productCatalog.forEach((item, index) => {
        formData.append(`catalogues`, item.file);

        productCatalogsPairs.push(item.name);
      });
    }

    formData.append('catalogues_name', JSON.stringify(productCatalogsPairs));


    this.commonService.createData('api/categories/addProductRange', formData).subscribe({
      next: (res: any) => {
        console.log('Form submitted successfully!', res);

        if (res.status == 201 || res.status == 200) {
          this.modalHandler.showToast(res.message || 'Product Added successfully', 'success');
          this.closeDialog();

          this.getAllRanages();
          this.createproductRangeForm.reset()

        } else {
          this.modalHandler.showError(res.message || 'Product Added gone wrong')
        }


        this.productImageFile = null;
      },
      error: (err: any) => {
        this.modalHandler.showError(err.message)
        this.closeDialog();
        console.error('Error submitting form:', err);
      }
    });
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


  //when u want to apply image validations then uncomment it 
  // onProductImageSelect(event: any): void {
  //   const file = event.target.files[0];
  //   if (!file) {
  //     console.log('file not found ----->');

  //   }
  //   const img = new Image();
  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     img.onload = () => {
  //       const width = img.width;
  //       const height = img.height;
  //       if (width > 150 && height > 135 && width < 330 && height < 215) {
  //       this.productImageFile = file;
  //       this.isNewProductImageSelected = true
  //       this.productimageError = '';


  //       this.createproductRangeForm.get('product_image')?.setErrors(null);
  //       } else {
  //         this.productImageFile = null;
  //         this.isNewProductImageSelected = false;
  //         this.productimageError = 'Image should be greater than 150(width)x135(height) and less than 330(width)x215(height).';
  //         this.createproductRangeForm.get('product_image')?.setErrors({ invalidSize: true });
  //         // fileInput.value = '';
  //       }
  //     };

  //     img.src = e.target.result;
  //   };

  //   reader.readAsDataURL(file);
  // }


  onProductImageSelect(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      console.log('file not found ----->');
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;

        this.productImageFile = file;
        this.isNewProductImageSelected = true;
        this.productimageError = '';
        this.createproductRangeForm.get('product_image')?.setErrors(null);

      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }


  onProductImageTouched(): void {
    const control = this.createproductRangeForm.get('product_image');
    control?.markAsTouched();

    if (!this.createproductRangeForm) {
      this.productrangetouchError = 'Product Range Image is required.';
      control?.setErrors({ required: true });
    } else {
      this.productrangetouchError = '';
      control?.setErrors(null);
    }
  }



  getCategoriesData() {
    const category_type_id = 0;
    this.commonService.getAllDataWithParams('api/categories/getCategories', { category_type_id }).subscribe({
      next: (res: any) => {

        if (res.status == 200 || res.status == 201) {

          // no need of this this.categoryData
          this.categoryData = res.data
            .filter((category: any) => category.isactive === true)
            .map((category: any) => ({
              id: category.id,
              name: category.name,
              description: category.description,
              image: category.image,
              lowRange: category.lowRange,
              highRange: category.highRange,
              fuel: category.fuel
            }));


          this.catData = res.data
            .filter((category: any) => category.isactive === true)
            .map((category: any) => ({
              id: category.id,
              name: category.name,
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


          this.incomingData
            .filter((category: any) => category.isactive === true)
            .forEach((category: any) => {
              category.fuel.forEach((fuel: any) => {
                fuel.ranges
                  .filter((range: any) => range.isactive === true)
                  .forEach((range: any) => {

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


  deleteProductRange(item: any) {
    console.log(item, 'jere os item id');

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
        const data_type = 'product_range';
        const product_range_id = item.productRangeId;
        this.commonService.postDataWithBody('api/categories/checkRelation', { data_type, product_range_id }).subscribe({
          next: (res: any) => {
            if (res.status == 400) {

              this.commonService.deleteData('api/categories/deleteProductRange/', item.productRangeId).subscribe({
                next: (res: any) => {
                  if (res.status == 201 || res.status == 200) {

                    this.getAllRanages();
                    this.modalHandler.showToast(res.message || 'Range Deleted successfully', 'success');
                    this.closeDialog();
                  } else {
                    this.modalHandler.showError(res['message']);
                    console.log('Invalid ', res);
                  }

                },
                error: (err) => {
                  console.error('Login failed', err);
                }
              })


            } else if (res.status == 200) {

              this.associatedData = res.data.product_range


              const associatedNames = this.associatedData.map((d: any) => d.product_name).join(', ');
              Swal.fire({
                title: 'Deletion Alert',
                html: `The following products are associated with this range: <strong>${associatedNames}</strong>.<br><br>Please remove these associations from Products before deleting.`,
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
        // this.deleteData(item)
        // Swal.fire('Deleted!', 'Your Banner has been deleted.', 'success');
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire('Cancelled', 'Your Bannner is safe :)', 'info');
        Swal.fire({
          title: 'Cancelled',
          html: 'Your Range is safe ',
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


  deleteData(item: any) {


    this.commonService.deleteData('api/categories/deleteProductRange/', item.productRangeId).subscribe({
      next: (res: any) => {
        if (res.status == 201 || res.status == 200) {

          this.getAllRanages();
          this.modalHandler.showToast(res.message || 'Range Deleted successfully', 'success');
          this.closeDialog();
        } else {
          this.modalHandler.showError(res['message']);
          console.log('Invalid ', res);
        }

      },
      error: (err) => {
        console.error('Login failed', err);
      }
    })

  }

  editProductRange(item: any, index: number) {
    console.log('let me check here item data', item);

    this.isEditMode = true;

    this.isnewProductRangeVisible = true;

    let matchedFuelId: number | null = null;

    this.selectedRangeIndex = index;

    this.editableData.forEach((dataItem: any) => {
      dataItem.fuel.forEach((fuelItem: any) => {
        const match = this.fuelData.find((fd: any) => fd.id === fuelItem.id);
        if (match && !matchedFuelId) {
          matchedFuelId = match.id;
        }
      });
    });

    console.log('here is the  ranges data', this.rangesData);

    this.filteredRanges = this.rangesData.filter((range: any) => range.productRangeId === item.productRangeId);

    const matchedRange = this.filteredRanges[0];

    if (matchedRange) {

      this.imageUrl = matchedRange?.productRangeImage
      this.imagePreviewUrl = this.imageUrl;

      console.log('matched range found', matchedRange);

      this.productRangeForm.patchValue({
        projectRangeid: matchedRange.productRangeId,
        category_id: matchedRange.categoryId || '',
        fuel_id: matchedRange.fuelId || matchedFuelId || null,
        range_from: matchedRange.lowRange || '',
        range_to: matchedRange.highRange || '',

      });





      this.productRangeForm.get('category_id')?.disable();
      this.productRangeForm.get('fuel_id')?.disable();
    } else {
      console.warn('No matching range found for productRangeId:', item.productRangeId);
    }



  }


  getProductRangeData(item: any) {
    const ids = [item.productRangeId];
    console.log(ids, 'here are the ids');

    this.commonService.getAllDataWithParams('api/categories/getProducts', ids).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.editableData = res.data
          console.log('here is the edit data--->', this.editableData);




          // this.productRangeForm.patchValue({
          //   editcategory_name: item.name || '',
          //   editdescription: item.description || '',
          //   editprf: '',
          //   editfuel_id: matchedFuelId || null,
          //   editcategory_image: item.categoryimage

          // });

          const fuelArray = this.productRangeForm.get('product_range_data') as FormArray;
          fuelArray.clear();

          this.editableData.forEach((item: any) => {

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


  onProductImageSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      console.log('file not found ----->');

    }
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        // if (width > 417 && height > 474 && width < 1130 && height < 817) {
        // if (width > 417 && height > 410 && width < 1130 && height < 817) {
        console.log('here ampther thisngs also');

        this.productImageFile = file;
        this.productimageError = '';
        this.createproductRangeForm.get('product_image')?.setErrors(null);
        // } else {
        //   this.productImageFile = null;
        //   this.productimageError = 'Image should be greater than 150(width)x135(height) and less than 330(width)x215(height).';
        //   this.createproductRangeForm.get('product_image')?.setErrors({ invalidSize: true });
        // 
        // }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }



  onProductImageSelecteForReplace(event: any): void {
    this.isProductImageReplace = true
    const file = event.target.files[0];
    if (!file) {
      console.log('file not found ----->');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      this.productRangeForm.get('product_image')?.setErrors({ invalidType: true });
      this.productImageFile = null;
      this.isNewProductImageSelected = false;
      this.imagePreviewUrl = null;
      this.productimageError = 'Only image files (JPG, PNG, WEBP, GIF) are allowed.';
      return; // 🚫 Stop here
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e: any) => {
      img.onload = () => {
        // const width = img.width;
        // const height = img.height;

        // if (width > 150 && height > 135 && width < 330 && height < 215) {
        this.productImageFile = file;
        this.isNewProductImageSelected = true;
        this.productimageError = '';
        this.productRangeForm.get('product_image')?.setErrors(null);


        this.imagePreviewUrl = reader.result;

        // } else {
        //   this.productImageFile = null;
        //   this.isNewProductImageSelected = false;
        //   this.productRangeForm.get('product_image')?.setErrors({ invalidSize: true });
        //   this.productimageError =
        //     'Image should be greater than 150(width)x135(height) and less than 330(width)x215(height).';
        //   this.productRangeForm.get('product_image')?.setErrors({ invalidSize: true });

        //   // ❌ Do not change preview if invalid
        // }
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  }



  updateProductRange() {

    const formData = new FormData();



    formData.append('range_from', this.productRangeForm.get('range_from')?.value)
    formData.append('range_to', this.productRangeForm.get('range_to')?.value)
    formData.append('id', this.productRangeForm.get('projectRangeid')?.value)


    if (this.isNewProductImageSelected && this.productImageFile) {
      console.log('New product range image selected:', this.productImageFile);
      formData.append('product_range_image', this.productImageFile, this.productImageFile.name);
    } else {
      console.log('No new image selected, not sending product_range_image.');
    }

    this.commonService.updateData('api/categories/updateSingleProductRange', formData).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          console.log(res);
          this.getAllRanages()
          this.modalHandler.showSuccess(res.message || 'Updated range successfully')
          this.closeDialog();
        }
      }, error(err) {

        console.log(err);


      },
    })
  }
  submit() {
    if (this.isEditMode) {
      this.updateProductRange();
    } else {
      this.addProcutRange();
    }
  }


  removeImage() {
    this.imageUrl = ''; // Or set this to null if you prefer
  }


  imageUrl: string | null = null;
  showBox: boolean = true; // <-- New flag to show/hide box

  triggerImageUpload() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLElement;
    fileInput.click();
  }


  removeBox() {
    this.showBox = false;
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput?.files?.[0];
    if (file) {
      this.imageUrl = URL.createObjectURL(file);
    }
  }


  replaceRange() {

    console.log('here replace function called ');

    this.filteredRanges = [];
    if (this.selectedRangeIndex === null) {
      console.error('No range selected for editing');
      return;
    }

    const from = this.productRangeForm.get('range_from')?.value;
    const to = this.productRangeForm.get('range_to')?.value;

    console.log('here is the from and to', from, '  ', to);


    if (from === null || to === null) {
      console.error('Range values missing');
      return;
    }

    const currentItem = this.filteredRanges[this.selectedRangeIndex];


    const updatedImageUrl = this.productImageFile
      ? URL.createObjectURL(this.productImageFile)
      : currentItem.productRangeImage;


    this.filteredRanges[this.selectedRangeIndex] = {
      ...currentItem,
      lowRange: from,
      highRange: to,
      productRangeImage: updatedImageUrl
    };

    console.log('Updated range:', this.filteredRanges[this.selectedRangeIndex]);


  }





  onFileInput(event: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    const control = this.createproductRangeForm.get('presentation');
    this.produtCatalogImageError = null;

    if (!files || files.length === 0) {
      control?.setValue(null);
      control?.markAsTouched();
      control?.setErrors({ required: true });
      return;
    }

    const fileNameInput = this.createproductRangeForm.get('file_name')?.value;

    if (!fileNameInput) {
      alert('Please enter a file name.');
      return;
    }

    Array.from(files).forEach((file) => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

      if (!validTypes.includes(file.type)) {
        this.produtCatalogImageError = `"${file.name}" is not a valid file type. Please upload only PDF or Word documents.`;
        control?.setErrors({ invalidType: true });
        return;
      }


      this.productCatalog.push({
        file: file,
        name: fileNameInput
      });

      control?.setValue(this.productCatalog);
      control?.setErrors(null);
      control?.markAsTouched();

      this.createproductRangeForm.patchValue({ file_name: '' });
      input.value = '';
    });
  }




  removePresentationFile(index: number) {
    this.productCatalog.splice(index, 1);
    this.createproductRangeForm.get('presentation')?.setValue(this.presentationFilePairs);
  }


  openImageDialog(item: number): void {
    this.selectedImageItems = [item]; // Wrap in array
    this.imageDialogVisible = true;
  }

  // ================


  changeProdImagePairs: { file: File, name: string }[] = [];
  editProductImageVisible: boolean = false;


  selectedUploadableImage: File | null = null;
  submittedImages: { name: string, file: File }[] = [];
  productRangeId!: number;

  editProductImage(item: any) {
    this.productRangeId = item.productRangeId;
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


  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedUploadableImage = input.files[0];
      this.addImages();
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

    formData.append('id', String(this.productRangeId));


    this.commonService.updateData('api/categories/uploadImagesForProductRange', formData).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          this.modalHandler.showToast(res.message);
          this.editProductImageVisible = false;
          this.closeDialog()
          this.getAllRanages();
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
