import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CarouselModule } from 'primeng/carousel';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CarouselModule ],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css'
})
export class HomeViewComponent {
    environment = environment;
  
  carouselImages = [
  { src: 'assets/Kirloskar_banner1.png', alt: 'Banner 1' },
    { src: 'assets/Kirloskar_banner2.png', alt: 'Banner 2' },
    { src: 'assets/Kirloskar_banner3.png', alt: 'Banner 3' }
  ];

constructor( private router:Router,private commonService:CommonService){}


ngOnInit(){
  this.getBannerData()
}

getBannerData(){
 this.commonService.getAllData('api/banner/getBannerApi').subscribe({
  next: (res:any) => {
   if(res.status==200 && res.message=='Request Successful'){
      const webBanners = res.data?.web || [];

        // Flatten and map prod_path to full image URLs
        this.carouselImages = webBanners.flatMap((banner: any) =>
          banner.attachments.map((att: any) => ({
            src: environment.apiUrl + att.prod_path,
            alt: 'Banner Image',
            forWeb: att.forWeb
          }))
        );

   }
    else if(res.status==400 && res.message=='Data Not Found'){
       this.carouselImages = [
  { src: 'assets/Kirloskar_banner1.png', alt: 'Banner 1' },
    { src: 'assets/Kirloskar_banner2.png', alt: 'Banner 2' },
    { src: 'assets/Kirloskar_banner3.png', alt: 'Banner 3' }
  ];
    }
    // console.log(res.status);
  },
  error: (error) => {
    // handle error
    console.error(error);
  }
});

}
  redirectpage(name:any){
    if (name == 'categories') {
      this.router.navigate(['home/categories'])
    }
    else if (name == 'all-range') {
      this.router.navigate(['home/all-range'])
    }
    else if (name == 'catalogues') {
      this.router.navigate(['home/catalogues'])
    }
    else if (name == 'presentations') {
      this.router.navigate(['home/presentations'])
    }
    else if (name == 'videos') {
      this.router.navigate(['home/videos'])
    }
    else if (name == 'Lead-Gen') {
      this.router.navigate(['home/Lead-Gen'])
    }

  }
  handleBannerClick(item: any) {
  const routeMap: { [key: string]: string } = {
    CATEGORY: 'categories',
    ALL_RANGE: 'all-range',
    PROFILE: 'profile',
    VIDEOS: 'videos',
    CATALOGUES: 'catalogues',
    PRESENTATIONS: 'presentations',
    'CUSTOMER REFERENCES': 'customer-references',
    'LEAD-GEN': 'Lead-Gen'
  };

  const routeKey = item.forWeb?.toUpperCase();

  if (routeKey && routeMap[routeKey]) {
    this.router.navigate(['home', routeMap[routeKey]]);
  } else {
    // No redirection if forWeb is null, undefined, or not mapped
    console.log('No redirection for this banner:', item);
  }
}

}