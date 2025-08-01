import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-presentations',
  standalone: true,
  imports: [CommonModule,TooltipModule],
  templateUrl: './view-presentations.component.html',
  styleUrl: './view-presentations.component.css'
})
export class ViewPresentationsComponent {
  environment=environment.apiUrl
 presentation_List:any = [];
 prodId:any=0
  org_id:number;
    constructor(private commonService:CommonService,private route:ActivatedRoute) {
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
      "media_type":"presentation",
      "product_id" : this.prodId
  }
    this.commonService.postDataWithBody('api/product/getMyMediaForMobileOrgBased', body).subscribe({
      next: (res: any) => {
        // console.log('Media Response:', res);
        // Handle the response here
        this.presentation_List=res.data.presentation
      },
      error: (err: any) => {
        console.error('Error fetching media:', err);
        // Optionally show a toast or alert
      }
    });
  }

openPresentation(link: string): void {
  const pre_link = this.environment + link;
  window.location.href = pre_link; // navigates to file, triggers download in same tab
}



}