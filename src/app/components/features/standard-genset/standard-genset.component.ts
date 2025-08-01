import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-standard-genset',
  standalone: true,
  imports: [CommonModule,CardModule,TooltipModule],
  templateUrl: './standard-genset.component.html',
  styleUrl: './standard-genset.component.css'
})
export class StandardGensetComponent {
  environment=environment
  gensetList:any=[]
  fuelList = [];
  catId:any;
  constructor(private commonService:CommonService,private location: Location,private route: ActivatedRoute,private router:Router){
    const catId = this.route.snapshot.paramMap.get('catId');
    this.catId=catId;
  }
  ngOnInit(){
    this.getCategoriesData();
  }
  getCategoriesData() {
    const url = 'api/categories/getCategories';
    const params = { category_type_id: this.catId };
  
    this.commonService.getAllDatawithpathVariable(url, params).subscribe({
      next: (res: any) => {
        // console.log(res);
  
        if (res.status === 200 && res.message === 'Data Found') {
       const genList= res.data;
       this.gensetList = genList.filter((item: any) => item.isactive);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
goToAllRange(data: any) {
  const categoryId = data.id;
  const fuelList = data.fuel || [];
  // const fuelNames = fuelList.map((f: any) => f.name).join(','); 
  // fuels: fuelNames
  this.router.navigate(['/home/all-range'], {
    queryParams: {
      catId: categoryId,
      fuelId:  0,
    
    }
  });
}

  goBack() {
    this.location.back();
  }
  }