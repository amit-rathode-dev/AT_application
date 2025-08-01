import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { TabViewModule } from 'primeng/tabview';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';
import { LoaderService } from '../../../services/loader.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CarouselModule,
    TabViewModule,
    ButtonModule,
    CardModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  environment = environment;
  productTitle = '';
  activeTab = 0;
  productData: any = {};
  tabs: any[] = [];
  images: any = [];
  actionCards: any[] = [];
  nodeID:any=0

  constructor(private commonService: CommonService, private location: Location,private loaderService:LoaderService,private route:ActivatedRoute,private router:Router) {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      this.nodeID=id
    });
  }

  ngOnInit() {
    this.loaderService.show()
    this.getProductData();
  }

  getProductData() {
    this.commonService.getDataByPathVariable('api/product/getProductById/', this.nodeID).subscribe({
      next: (res: any) => {
        this.productData = res.data;
      
        this.productTitle = this.productData.product_name;

        // Initialize tabs: one for base product and one for each variant
        this.tabs = [
          { header: this.productData.variant_name, data: this.productData },
          ...this.productData.variants.map((variant: any) => ({
            header: variant.variant_name,
            data: variant
          }))
        ];

        // Update images and action cards for the base product initially
        this.updateImagesAndCards(this.productData);
        this.loaderService.hide()
      },
      error: (err: any) => {
        console.error('Error fetching product data:', err);
      }
    });
  }

  // Update images and action cards based on selected tab data
  updateImagesAndCards(data: any) {
    this.images = data.product_image?.length
      ? data.product_image.map((img: any) => environment.apiUrl + img.product_image)
      : ['assets/kga-image.png'];

    this.actionCards = [
      {
        title: 'Catalogues',
        image: '/assets/catalouge.png',
        link: environment.apiUrl + data.catalogues?.[0]?.catalogues || '/catalogues',
        icon: 'assets/non-ad-catalogs.svg'
      },
      {
        title: 'Presentations',
        image: 'assets/presentation_main.png',
        link: environment.apiUrl + data.presentation?.[0]?.file_path || '/presentations',
        icon: 'assets/non-ad-presentations.svg'
      },
    ];
    setTimeout(() => {
      this.loaderService.hide()
        }, 500);
   
  }

  // Handle tab change to update images and action cards
  onTabChange(event: any) {
    this.loaderService.show()
    const selectedTab = this.tabs[event.index];
    this.updateImagesAndCards(selectedTab.data);
  
  }

  navigateTo(type: string) {
    if (type === 'Catalogues') {
      this.router.navigate(['home/catalogues'], {
        queryParams: { prod_id: this.nodeID }
      });
    } else if (type === 'Presentations') {
      this.router.navigate(['home/presentations'], {
        queryParams: { prod_id: this.nodeID }
      });
    } else if (type === 'YouTube') {
      this.router.navigate(['home/videos'], {
        queryParams: { prod_id: this.nodeID }
      });
    } else if (type === 'CustomerRef') {
      this.router.navigate(['home/customer-ref'], {
        queryParams: { prod_id: this.nodeID }
      });
    }
  }
  
  
  // goToCustomerRef(){
  //   this.router.navigate(['/home/customer-ref'])
  // }
  goBack() {
    this.location.back();
  }
}