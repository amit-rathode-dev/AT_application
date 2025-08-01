import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonService } from '../../../services/common.service';
import { TooltipModule } from 'primeng/tooltip';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-view-videos',
  standalone: true,
  imports: [CommonModule,DialogModule,ProgressSpinnerModule,TooltipModule],
  templateUrl: './view-videos.component.html',
  styleUrl: './view-videos.component.css'
})
export class ViewVideosComponent {
  video_List:any = [];
    // { title: 'https://youtu.be/80jj8s-Ov4s?si=U-lGc7c9SiYCGAR8', image: 'assets/youtube_icon.png' },
   
  showDialog = false;
  selectedVideoUrl: SafeResourceUrl | null = null;
  loading = false;
  org_id:number;
  prodId:any=0
  constructor(private sanitizer: DomSanitizer,private commonService:CommonService,private route:ActivatedRoute) {
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
    "media_type":"video",
    "product_id" : this.prodId
}
  this.commonService.postDataWithBody('api/product/getMyMediaForMobileOrgBased', body).subscribe({
    next: (res: any) => {
      // console.log('Media Response:', res);
      // Handle the response here
      this.video_List=res.data.video
    },
    error: (err: any) => {
      console.error('Error fetching media:', err);
      // Optionally show a toast or alert
    }
  });
}

  openDialog(link: string) {
    const videoIdMatch = link.match(/(?:youtu\.be\/|v=)([^&\n?#]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
    this.selectedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    this.loading = true;
    this.showDialog = true;
  }

  onVideoLoad() {
    this.loading = false;
  }
}