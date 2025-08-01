import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { DomSanitizer,SafeResourceUrl  } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-catalouges',
  standalone: true,
  imports: [TooltipModule,CommonModule,DialogModule,ProgressSpinnerModule],
  templateUrl: './view-catalouges.component.html',
  styleUrl: './view-catalouges.component.css'
})
export class ViewCatalougesComponent {
  environment=environment.apiUrl
  selectedFilePath: SafeResourceUrl | null = null;  // ✅ Fix is here

  catalogues_List:any = [];
  selectedFileName:any
showDialog: boolean = false;
isLoading: boolean = false;
isPdfFile: boolean = false;
org_id:number;
prodId:any=0;
  constructor(private commonService:CommonService,private sanitizer: DomSanitizer,private route:ActivatedRoute) {
    this.org_id =  Number(localStorage.getItem('org_id'));
    this.route.queryParams.subscribe(param=>{
      const product_Id =  Number(param['prod_id']);
      this.prodId=product_Id;
    })
    // console.log(this.org_id)
  }

  ngOnInit(){
    this.getAllMedia()
  }
 getAllMedia() {
  const body = {
    "org_id":this.org_id,
    "media_type":"catalogues",
    "product_id" : this.prodId
}
  this.commonService.postDataWithBody('api/product/getMyMediaForMobileOrgBased', body).subscribe({
    next: (res: any) => {
      // console.log('Media Response:', res);
      // Handle the response here
      this.catalogues_List=res.data.catalogues
    },
    error: (err: any) => {
      console.error('Error fetching media:', err);
      // Optionally show a toast or alert
    }
  });
}




openPDF(data1: any): void {
  const data = data1;
  const fullLink = this.environment + data.file_path;
  this.isPdfFile = fullLink.endsWith('.pdf');
  this.selectedFileName = data.file_name;
  this.selectedFilePath = this.sanitizer.bypassSecurityTrustResourceUrl(fullLink);
  console.log(this.selectedFilePath);
  
  this.isLoading = true; // Start loader
  this.showDialog = true;
}
onIframeLoad() {
  this.isLoading = false;
}



//   openPDF(link: string): void {
//     const prelink=environment.apiUrl+link
//   const newTab = window.open('', '_blank');
//   if (!newTab) return;

//   const loaderHtml = `
//     <html>
//       <head>
//         <title>Loading PDF...</title>
//         <style>
//           body {
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             height: 100vh;
//             font-family: sans-serif;
//             background: #fff;
//           }
//           .spinner {
//             border: 8px solid #f3f3f3;
//             border-top: 8px solid #009688;
//             border-radius: 50%;
//             width: 60px;
//             height: 60px;
//             animation: spin 1s linear infinite;
//             margin-left:2rem;
//           }
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         </style>
//       </head>
//       <body>
//         <div>
//           <div class="spinner"></div>
//           <p style="text-align:center;margin-top:1rem;">Loading catalogue...</p>
//         </div>
//         <script>
//           setTimeout(() => {
//             window.location.href = "${prelink}";
//           }, 2000);
//         </script>
//       </body>
//     </html>
//   `;

//   newTab.document.write(loaderHtml);
//   newTab.document.close();
// }

}