
import { CommonModule } from '@angular/common';
import { Component, model, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../services/common.service';
import { max, Observable, of, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
import { VideoplayerService } from '../../../services/videoplayer.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-variant',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, ReusablemodulesComponent, TabViewModule, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, TableModule, GalleriaModule],
  templateUrl: './variant.component.html',
  styleUrl: './variant.component.css'
})
export class VariantComponent {

  table: any;
  step: number = 1;
  visible: boolean = false;
  variantVisible: boolean = false;
  imageDialogVisible: boolean = false;
  showDetailDialog: boolean = false;

  // is_variant: any = true;
  incomingDataProductData: any[] = [];
  VariantData: any[] = [];

  fuelData: any[] = [];
  unitData: any = [] = [];
  productData: any[] = [];
  rangesData: any[] = [];
  incomingData: any[] = [];
  categoryData: any = [] = [];
  catData: any = [] = [];
  selectedImages: any[] = [];
  selectedPresentations: any[] = [];
  images: any[] = [];
  variantWiseData: any[] = [];
  tempGensetData: any[] = [];
  presentationDialogVisible: boolean = false;
  videoLinkMap: { [key: number]: string[] } = {};
  activeTabIndex: number = 0;

  selectedVideoList: any[] = []; gensetData: any[] = [];
  engineData: any[] = [];
  alternatorData: any[] = [];
  isEditMode: boolean = false;

    public environment = environment.apiUrl;



  showVideoPopup: boolean = false;



  productFormVariantForm!: FormGroup;
  productFormVariantForm2!: FormGroup;


  constructor(private fb: FormBuilder, private commonService: CommonService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private router: Router) {
    this.getAllRanages();

  }

  ngOnInit() {
    // this.getProductData();
    this.getAllRanages();
    this.initForm()
    this.getFuelData();
    this.getAllUnit();
    this.getCategoriesData();
    this.getProductData();




    // this.createForm();
  }

  initForm() {
    this.productFormVariantForm = this.fb.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      range: ['', Validators.required],
      fuel: ['', Validators.required],
      description: ['', Validators.required],
      productId: ['', Validators.required],
      variant_name: ['', Validators.required]

    })

    this.productFormVariantForm2 = this.fb.group({
      modelName: ['', Validators.required],
      fuel_tank: ['', Validators.required],
      unitForFuel: ['', Validators.required],
      weight: ['', Validators.required],
      length: ['', Validators.required],
      width: ['', Validators.required],
      height: ['', Validators.required],
      gensetUnit: ['', Validators.required],
      dimension_unit: ['', Validators.required],

      // Step 2: Engine Specification
      engineModel: ['', Validators.required],
      cylinders: ['', Validators.required],
      unitForClynder: ['', Validators.required],
      cubeCapacity: ['', Validators.required],
      cubeCapacityUnit: ['', Validators.required],
      lube: ['', Validators.required],
      lubeQuantity: ['', Validators.required],
      adblue: ['', Validators.required],
      adblueUnit: ['', Validators.required],

      // Step 2: Alternator Specification
      efficiency: ['', Validators.required],
      alternatorUnit: ['', Validators.required],
      alternattorVoltage: ['', Validators.required],
      max_time_to_rated_unit: ['', Validators.required],
      alternatorQuantity: [''],
      // dimension_unit:['']
    });
  }
  createNew() {
    this.variantVisible = true;
    this.step = 1;
    this.visible = true
    this.productFormVariantForm.reset();
    this.productFormVariantForm2.reset();
  }

  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }


  closeDialog() {

    this.visible = false;
    this.variantVisible = false;

    this.productFormVariantForm.reset();
    this.productFormVariantForm2.reset();

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

      this.productFormVariantForm.patchValue({
        category: '',
        fuel: '',
        range: '',
        description: ''

      });
    }

  }

  goToNextStepForVariant() {

    this.productFormVariantForm.markAllAsTouched();

    if (this.productFormVariantForm.valid) {
      this.step = 2;
    }

  }


  goToPreviousStep() {
    console.log('here steo 1 is callled ');

    this.step = 1;
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




  addVariantData() {

    // this.productFormVariantForm2.markAllAsTouched();
    // if (this.productFormVariantForm2.invalid) {

    //   return
    // }


    // const formData = new FormData();
    // formData.append('product_id', this.productFormVariantForm.get('productId')?.value);


    // const genset = {
    //   model: this.productFormVariantForm2.get('modelName')?.value,
    //   fuel_tank_capacity: +this.productFormVariantForm2.get('fuel_tank')?.value,

    //   fuel_tank_capacity_unit: +this.productFormVariantForm2.get('unitForFuel')?.value,
    //   weight: this.productFormVariantForm2.get('weight')?.value,
    //   weight_unit: this.productFormVariantForm2.get('range')?.value,
    //   dimension: [
    //     +this.productFormVariantForm2.get('length')?.value,
    //     +this.productFormVariantForm2.get('width')?.value,
    //     +this.productFormVariantForm2.get('height')?.value,
    //   ],
    //   dimension_unit: +this.productFormVariantForm2.get('dimension_unit')?.value

    // };
    // formData.append('genset', JSON.stringify(genset));

    // const engine = {
    //   model: this.productFormVariantForm2.get('engineModel')?.value,
    //   no_of_cylinder: +this.productFormVariantForm2.get('cylinders')?.value,
    //   no_of_cylinder_unit: +this.productFormVariantForm2.get('unitForClynder')?.value,
    //   cubic_capacity: +this.productFormVariantForm2.get('cubeCapacity')?.value,
    //   cubic_capacity_unit: +this.productFormVariantForm2.get('cubeCapacityUnit')?.value,
    //   lube_oil_change: +this.productFormVariantForm2.get('lube')?.value,
    //   lube_oil_change_unit: +this.productFormVariantForm2.get('lubeQuantity')?.value,
    //   adblue: +this.productFormVariantForm2.get('adblue')?.value,
    //   adblue_unit: +this.productFormVariantForm2.get('adblueUnit')?.value,
    // };
    // formData.append('engine', JSON.stringify(engine));

    // const alternator = {
    //   alternator: this.productFormVariantForm2.get('efficiency')?.value,
    //   alternator_unit: +this.productFormVariantForm2.get('alternatorUnit')?.value,

    //   max_time_to_rated: this.productFormVariantForm2.get('alternattorVoltage')?.value,
    //   max_time_to_rated_unit: +this.productFormVariantForm2.get('max_time_to_rated_unit')?.value,
    // };


    // formData.append('alternator', JSON.stringify(alternator));



    this.productFormVariantForm2.markAllAsTouched();
    if (this.productFormVariantForm2.invalid) {
      return;
    }

    const genset = {
      model: this.productFormVariantForm2.get('modelName')?.value,
      fuel_tank_capacity: this.productFormVariantForm2.get('fuel_tank')?.value,
      fuel_tank_capacity_unit: +this.productFormVariantForm2.get('unitForFuel')?.value,
      weight: this.productFormVariantForm2.get('weight')?.value,
      weight_unit: +this.productFormVariantForm.get('gensetUnit')?.value,  // moved from form 1
      dimension: [
        +this.productFormVariantForm2.get('length')?.value,
        +this.productFormVariantForm2.get('height')?.value,
        +this.productFormVariantForm2.get('width')?.value,
      ],
      dimension_unit: +this.productFormVariantForm2.get('dimension_unit')?.value
    };

    const engine = {
      model: this.productFormVariantForm2.get('engineModel')?.value,
      no_of_cylinder: this.productFormVariantForm2.get('cylinders')?.value,
      no_of_cylinder_unit: +this.productFormVariantForm2.get('unitForClynder')?.value,
      cubic_capacity: this.productFormVariantForm2.get('cubeCapacity')?.value,
      cubic_capacity_unit: +this.productFormVariantForm2.get('cubeCapacityUnit')?.value,
      lube_oil_change: +this.productFormVariantForm2.get('lube')?.value,
      lube_oil_change_unit: +this.productFormVariantForm2.get('lubeQuantity')?.value,
      adblue: this.productFormVariantForm2.get('adblue')?.value,
      adblue_unit: +this.productFormVariantForm2.get('adblueUnit')?.value,
    };

    const alternator = {
      alternator: this.productFormVariantForm2.get('efficiency')?.value,
      alternator_unit: +this.productFormVariantForm2.get('alternatorUnit')?.value,
      max_time_to_rated: this.productFormVariantForm2.get('alternattorVoltage')?.value,
      max_time_to_rated_unit: +this.productFormVariantForm2.get('max_time_to_rated_unit')?.value,
    };

    const payload = {
      "product_id": +this.productFormVariantForm.get('productId')?.value,
      "variant_name": this.productFormVariantForm.get('variant_name')?.value,
      "genset": genset,
      "engine": engine,
      "alternator": alternator
    };

    this.commonService.createData('api/product/addProductVariant', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          console.log('here creat product successfully');
          this.closeDialog();
          this.modelaHandler.showToast(res.message || 'Product created successfully');
          this.getProductData();

          // this.modelaHandler.showSuccess(res.message, 'Product Added Successfully')

        } else {
          this.closeDialog();
          this.getProductData();
          this.modelaHandler.showSuccess(res.message, 'Product Added Failed')
        }
      }, error(err) {

        console.log(err);

      },
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

  getCategoriesData() {
    this.commonService.getAllData('api/categories/getCategories').subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {

          this.categoryData = res.data
          .filter((itr:any)=>itr.isactive === true)
          .map((category: any) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            image: category.image,
            lowRange: category.lowRange,
            highRange: category.highRange,
            fuel: category.fuel
          }));


          this.catData = res.data.map((category: any) => ({
            id: category.id,
            name: category.name,
          }));


        }
      }
    })
  }


  getProductData() {
    const queryParams = { is_variant: true }
    this.commonService.getAllDataWithParams('api/product/getProductList', queryParams
    ).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status == 201) {
          this.incomingDataProductData = res.data
          .filter((item: any) => item.isactive === true);
          this.VariantData = this.incomingDataProductData.filter((item: any) => item.is_variant === true && item.isactive === true);



          this.videoLinkMap = {};

          this.VariantData.forEach((product: any) => {
            if (Array.isArray(product.video_link) && product.video_link.length > 0) {
              this.videoLinkMap[product.id] = product.video_link;
            }
          });


        }
      }
    })
  }

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


  openPresentationDialog(presentations: any[]) {
    this.selectedPresentations = presentations;
    console.log('here is the selected presentation', this.selectedPresentations);

    this.presentationDialogVisible = true;
  }

  closePresentationDialog() {
    this.presentationDialogVisible = false
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
      console.error('File URL is not valid:', fileUrl);
    }
  }




  openDetailPopup(item: any) {
    this.showDetailDialog = true;

    // Arrays to hold the enriched specification data for the selected item
    let gensetData: any[] = [];
    let engineData: any[] = [];
    let alternatorData: any[] = [];

    // Find the variant with matching id
    const selectedVariant = this.VariantData.find((variant: any) => variant.id === item.id);

    if (selectedVariant) {
      const {
        id,
        product_name,
        description,
        category_id,
        is_variant,
        variant_name,
        category_name,
        fuel_id,
        fuel_name,
        product_range_id,
        range_from,
        range_to,
        specification
      } = selectedVariant;

      const baseProductInfo = {
        id,
        product_name,
        description,
        category_id,
        is_variant,
        variant_name,
        category_name,
        fuel_id,
        fuel_name,
        product_range_id,
        range_from,
        range_to
      };

      if (specification) {
        if (Array.isArray(specification.genset)) {
          specification.genset.forEach((spec: any) => {
            gensetData.push({ ...spec, ...baseProductInfo });
          });
        }

        if (Array.isArray(specification.engine)) {
          specification.engine.forEach((spec: any) => {
            engineData.push({ ...spec, ...baseProductInfo });
          });
        }

        if (Array.isArray(specification.alternator)) {
          specification.alternator.forEach((spec: any) => {
            alternatorData.push({ ...spec, ...baseProductInfo });
          });
        }
      }


      console.log("Genset Data:", gensetData);
      console.log("Engine Data:", engineData);
      console.log("Alternator Data:", alternatorData);

      // Optionally store in component properties to display in dialog
      this.gensetData = gensetData;
      this.engineData = engineData;
      this.alternatorData = alternatorData;
    } else {
      console.warn('No matching variant found for id:', item.id);
    }
  }


  getProductDataById(item: any) {
    this.activeTabIndex = 0;
    this.showDetailDialog = true;

    this.commonService.getDataByPathVariable('api/product/getProductById/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.variantWiseData = Array.isArray(res.data) ? res.data : [res.data];

          const onlyproductData = this.variantWiseData?.map((item: any) => ({
            variant_name: item.variant_name,
            category_id: item.category_id,
            description: item.description,
            product_name: item.product_name,
            fuel_name: item.fuel_name,
            fuel_id: item.fuel_id,
            category_name: item.category_name,
            is_variant: item.is_variant,

          }));


          const specification = this.variantWiseData[0].specification;

          const gensetSpecs = specification?.genset ?? [];
          const engineSpecs = specification?.engine ?? [];
          const alternatorSpecs = specification?.alternator ?? [];

          const allSpecs = [...gensetSpecs, ...engineSpecs, ...alternatorSpecs];

          console.log(allSpecs, 'all spec');

          this.tempGensetData = allSpecs.map((spec: any) => ({
            ...spec,
            ...onlyproductData[0]
          }));
        }
      }

    })
  }





  // deleteVariant(item: any) {

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You are about to delete the Variant. This action cannot be undone.',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No',
  //     reverseButtons: true,
  //     buttonsStyling: false,
  //     customClass: {
  //       confirmButton: 'swal2-confirm-custom',
  //       cancelButton: 'swal2-cancel-custom',
  //     }
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.deleteVariantData(item)
  //       Swal.fire('Deleted!', 'Your Variant has been deleted.', 'success');
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {

  //       Swal.fire('Cancelled', 'Your Variant is safe :)', 'info');
  //     }
  //   });


  // }


  
  deleteVariant(item: any) {

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
        this.deleteProductData(item)
     
        Swal.fire({
          title: 'Deleted!',
          text: 'Your Variant has been deleted.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 2000,
          timerProgressBar: true
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {

        Swal.fire({
          title: 'Cancelled!',
          text: 'Your Variant is safe.',
          icon: 'success',
          confirmButtonColor: '#008080',
          timer: 1000,
          timerProgressBar: true
        });
      }
    });


  }


  deleteVariantData(item: any) {

    this.commonService.deleteData('api/product/deleteProduct/', item.id).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.getProductData();
          this.modelaHandler.showSuccess(res.message, 'Variant Deleted Successfully')
        }
      }
    })
  }


  onProductClick(productId: number): void {
    const videoList = this.videoLinkMap[productId] || [];

    if (videoList.length === 0) {
      console.warn('No videos for this product');
      return;
    }

    this.selectedVideoList = videoList;
    this.videoService.openVideoPlayer(this.selectedVideoList);
    this.selectedVideoList = videoList;
    this.showVideoPopup = true;

    this.router.navigate(['/video']);
  }


    closeSpecificationDialog() {
    this.showDetailDialog = false;
  }


  
  deleteProductData(item: any) {
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
}
