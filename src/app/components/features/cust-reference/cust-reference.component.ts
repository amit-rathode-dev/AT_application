import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { DomSanitizer,SafeResourceUrl  } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cust-reference',
  standalone: true,
  imports: [CommonModule,TooltipModule,DialogModule,ProgressSpinnerModule ],
  templateUrl: './cust-reference.component.html',
  styleUrl: './cust-reference.component.css'
})
export class CustReferenceComponent {
  environment=environment.apiUrl
  customer_Ref_List:any = [];
  selectedFilePath: SafeResourceUrl | null = null;  // ✅ Fix is here
  selectedFileName:any
showDialog: boolean = false;
isLoading: boolean = false;
prodId:number=0

   org_id:number;
     constructor(private commonService:CommonService,private sanitizer: DomSanitizer,private route:ActivatedRoute) {
       this.org_id =  Number(localStorage.getItem('org_id'));
       // console.log(this.org_id)
       this.route.queryParams.subscribe(param=>{
        const product_Id = Number(param['prod_id']);
        this.prodId=product_Id;
      })
     }
   
     ngOnInit(){
       this.getAllMedia()
     }
    getAllMedia() {
     const body = {
       "org_id":this.org_id,
       "media_type":"customer_referance",
       "product_id" : this.prodId
   }
     this.commonService.postDataWithBody('api/product/getMyMediaForMobileOrgBased', body).subscribe({
       next: (res: any) => {
        //  console.log('Media Response:', res);
         // Handle the response here
         this.customer_Ref_List=res.data.customer_referance
       },
       error: (err: any) => {
         console.error('Error fetching media:', err);
         // Optionally show a toast or alert
       }
     });
   }


   openPresentation(data1: any): void {
    const data = data1;
    const fullLink = this.environment + data.file_path;
  
    this.selectedFileName = data.file_name;
    this.selectedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(fullLink);
    this.isLoading = true; // Start loader
    this.showDialog = true;
  }
  onIframeLoad() {
    this.isLoading = false;
  }
  
 
 }