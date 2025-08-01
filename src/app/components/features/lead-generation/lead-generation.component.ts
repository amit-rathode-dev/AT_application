import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { MessagesModule } from 'primeng/messages';
import { CommonService } from '../../../services/common.service';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { CalendarModule } from 'primeng/calendar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-lead-generation',
  standalone: true,
  imports: [
     DropdownModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    InputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    PanelModule ,
    MessagesModule,
    CalendarModule,
    CommonModule
  ],
  templateUrl: './lead-generation.component.html',
  styleUrl: './lead-generation.component.css'
})
export class LeadGenerationComponent {
 registrationForm!: FormGroup;
productCategories: any[] = [];
fuels: any[] = [];
kvaRatings: any[] = [];
// loading = false;
 
allProductListData: any[] = [];
 asm_id!:number;
selectedProductId: number = 0;
selectedFuelId: number = 0;
selectedGoemId: number = 0;
  goems:any = [];
  kgds:any = [];
  states:any = [];
  minDate: Date = new Date();
  org_Type:any=''
Cities:any=[]
  constructor(private fb: FormBuilder,private commonServise:CommonService, private modalHandler: ModealHandlerService) {
    this.asm_id=Number(localStorage.getItem('user_id'));
      this.org_Type=(localStorage.getItem('org_type'));
    const today = new Date();
    today.setHours(0, 0, 0, 0); // resets time to 00:00
    this.minDate = today;
    // console.log(this.org_Type);
    
  }
 
  ngOnInit() {
    this.registrationForm = this.fb.group({
      product_id: ['', Validators.required],
      fuel_id: ['', Validators.required],
      category_id: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      goem_id: [''],
      Kgd_id: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_no: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
     
      company_address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      notes: [''],
      kgd_name:[''],
      goem_name:[''],
      category_name:[''],
    lat: [],
    long: [],
    geo_location: [''],
    pulse_purchase_date:["",Validators.required],
    purchase_date:"",
    });
    this.getProductData(0,0)
    this.getGoemData();
    this.getStateList();
   
  }
 
  getLocation() {
    if (!navigator.geolocation || !navigator.permissions) {
      console.error('Geolocation or Permissions API not supported');
      return;
    }
 
    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      // console.log('Permission status:', permissionStatus.state);
 
      if (permissionStatus.state === 'granted') {
        // Permission already granted
        this.fetchGeolocation();
      } else if (permissionStatus.state === 'prompt') {
        // Will trigger browser popup
        this.fetchGeolocation();
      } else if (permissionStatus.state === 'denied') {
        // Show custom message/toast to user
        alert('Geolocation permission denied. Please allow location access in your browser settings.');
      }
 
      // Optional: listen for permission changes
      permissionStatus.onchange = () => {
        console.log('Permission changed to:', permissionStatus.state);
      };
    });
  }
 
  fetchGeolocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
 
        this.registrationForm.patchValue({
          lat: lat,
          long: long,
          geo_location: `NA`
        });
 
        this.onSubmit()
 
      },
      (error) => {
        console.error('Geolocation error:', error.message);
      }
    );
  }
 
 
 
getProductData(id: number=0 , fuel_id: number=0) {
  const url = `api/categories/getProducts?id=${id}&fuel_id=${fuel_id}`;
  this.commonServise.getAllData(url).subscribe({
    next: (res: any) => {
     
      this.allProductListData=res.data
 
      this.productCategories = this.allProductListData
      .filter((item: any) => item.isactive)
      .map((item: any) => ({
        label: item.category,
        value: item.id
      }));
   
 
      // console.log(this.productCategories);
    },
    error: (err: any) => {
      console.error('Error fetching product data:', err);
    },
  });
}
 
 
  onSubmit() {
 
    // this.loading=true
     const categoryId= this.registrationForm.get('category_id')?.value
      const selected = this.productCategories.find((cat:any) => cat.value === categoryId);
      const goem_Id= this.registrationForm.get('goem_id')?.value
      const selected_goem = this.goems.find((cat:any) => cat.org_id === goem_Id);
      const kgd_Id= this.registrationForm.get('Kgd_id')?.value
      const selected_Kgd = this.kgds.find((cat:any) => cat.org_id === kgd_Id);
      this.registrationForm.patchValue({
        category_name: selected ? selected.label : '',
        kgd_name:selected_Kgd ? selected_Kgd.org_name : '',
        goem_name:selected_goem ? selected_goem.org_name : ''
      });
 
      const pulseDate: Date = this.registrationForm.get('pulse_purchase_date')?.value;
      const formattedPulseDate = this.formatDateManually(new Date(pulseDate));
 
      const purchaseDate: Date = this.registrationForm.get('pulse_purchase_date')?.value;
      const formattedPurchaseDate = purchaseDate ? new Date(purchaseDate).toISOString() : null;
 
      const long= this.registrationForm.get('long')?.value
      const lat= this.registrationForm.get('lat')?.value
     
     
      const payload = {
        ...this.registrationForm.value,
        pulse_purchase_date: formattedPulseDate,
        purchase_date:formattedPurchaseDate
      };
      // console.log("formdata",payload);
 
 
if(long!=null && lat!=null){
  // console.log("submited");
  // alert('submited')
 
    if (this.registrationForm.valid) {
         this.commonServise.postDataWithBody('api/lead/createLead',payload).subscribe({
    next: (res: any) => {
   
 
      if(res.status==200){
 
        console.log('successfully Submited');
        this.registrationForm.reset()
        this.modalHandler.showSuccess(res['message']);
        // this.loading=false
      }else{
        this.modalHandler.showError(res.message)
        // this.loading=false
      }
    },
    error: (err: any) => {
 
       this.modalHandler.showError(err.message || 'Error fetching submit data');
      //  this.loading=false
    },
  });
    }
}else{
  this.getLocation()
}
 
 
  }
 
 
  formatDateManually(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const yyyy = date.getFullYear();
    const HH = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${MM}/${dd}/${yyyy} ${HH}:${mm}:${ss}`;
  }
  onCategoryChange(event: any) {
  const categoryId = event.value;
  this.selectedProductId = categoryId;
 
  // Find selected product category data
  const selectedCategory = this.allProductListData.find((item) => item.id === categoryId);
 
  // Populate fuel dropdown based on selected category
  this.fuels = (selectedCategory?.fuel || []).map((fuel: any) => ({
   
   
    label: fuel.name,
    value: fuel.id,
    fullData: fuel  // keep full data for further drill down
  }));
 
  // Reset next dropdowns
  this.kvaRatings = [];
  this.registrationForm.get('fuel_id')?.reset();
  this.registrationForm.get('kvaRating')?.reset();
}
 
// Triggered when a fuel is selected
onFuelChange(event: any) {
  const fuelId = event.value;
  this.selectedFuelId = fuelId;
 
  const selectedFuel = this.fuels.find(f => f.value === fuelId)?.fullData;
 
  // Get all nodes from all ranges
  const nodes = (selectedFuel?.ranges || [])
    .flatMap((range: any) => range.nodes)
    .filter((node: any) => node.isactive);
 
  // Populate kvaRatings dropdown
  this.kvaRatings = nodes.map((node: any) => ({
    label: node.value,
    value: node.id
  }));
 
  // Reset KVA if needed
  this.registrationForm.get('kvaRating')?.reset();
}
onGOEMChange(event: any){
   const goemId = event.value;
  this.selectedGoemId = goemId;
  this.getKgdData(this.selectedGoemId )
}
onState_change(event: any){
   const stateName = event.value;
   const stateId = this.states.find((f:any) => f.name === stateName);
 
  //  console.log(stateId);
   
  this.getCityList(stateId.id )
}
getGoemData(){
       const data={
    "data_type":"goem",
    "goem_id":0,
    "asm_id":this.asm_id,
    "nsm_id":0,
    "zsm_id":0,
    "rsm_id":0
}
    this.commonServise.postDataWithBody('api/product/getGoemOrKgdData',data).subscribe({
    next: (res: any) => {
 
   
      this.goems=res.data.goem.filter((item:any)=>item.isactive)
      // console.log("wewde",this.goems);
    },
    error: (err: any) => {
      console.error('Error fetching product data:', err);
    },
  });
}
getKgdData(goemid:any){
       const data={
    "data_type":"kgd",
    "goem_id":goemid,
    "asm_id":0,
    "nsm_id":0,
    "zsm_id":0,
    "rsm_id":0
}
    this.commonServise.postDataWithBody('api/product/getGoemOrKgdData',data).subscribe({
    next: (res: any) => {
 
   
      this.kgds=res.data.kgd.filter((item:any)=>item.isactive)
      // console.log('kgd',this.kgds);
    },
    error: (err: any) => {
      console.error('Error fetching product data:', err);
    },
  });
}
 
getStateList(){
    this.commonServise.getAllData('api/lead/getStateForLead').subscribe({
    next: (res: any) => {
      this.states=res.data
        //  console.log(res.data);
    },
    error: (err: any) => {
      console.error('Error fetching product data:', err);
    },
  });
}
enforceRange(event: any) {
  // const input = event.target.value;
  // const lastDigit = input.slice(-1);
  // if (lastDigit >= '1' && lastDigit <= '5') {
  //   this.registrationForm.get('quantity')?.setValue(+lastDigit);
  // } else {
  //   this.registrationForm.get('quantity')?.setValue(1);
  //   event.target.value = '';
  // }
}
 
getCityList(stateId:any){
  const data={
    state_id:stateId
  }
    this.commonServise.postDataWithBody('api/lead/getCityByStateId',data).subscribe({
    next: (res: any) => {
      this.Cities=res.data
        //  console.log('city',res.data);
    },
    error: (err: any) => {
      console.error('Error fetching product data:', err);
    },
  });
}
allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.charCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}
 
isInvalid(controlName: string): boolean {
  const control = this.registrationForm.get(controlName);
  return !!(control && control.invalid && (control.dirty || control.touched));
}
 
 
}