import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TooltipModule } from 'primeng/tooltip';
import { CommonService } from '../../../services/common.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule ,CardModule,TooltipModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
    environment = environment;
gensetList:any = [
    // {
    //   title: 'Kirloskar Standard Genset',
    //   image: 'assets/Standard_Genset.png'
    // },
    // {
    //   title: 'Kirloskar Advanced Manufactured Gensets',
    //   image: 'assets/Advanced_Genset.png'
    // },
    // {
    //   title: 'Kirloskar Standard Genset',
    //   image: 'assets/Kirloskar_banner2.png'
    // },
    // {
    //   title: 'Kirloskar Advanced Manufactured Gensets',
    //   image: 'assets/presentations1.png'
    // }
  ];

constructor(private commonService:CommonService,private router:Router){}
ngOnInit(){
  this.getCategoriesData();
}
  getCategoriesData(){
 this.commonService.getAllData('api/categories/getAllCategoriesType').subscribe({
  next: (res:any) => {
  //  console.log(res);
   
    if(res.status==200 && res.message=='Data Found'){
  this.gensetList=res.data
    }
    // console.log(res.status);
  },
  error: (error) => {
    // handle error
    console.error(error);
  }
});

}
goToGenset(catId:any){
  // console.log(catId);
  this.router.navigate(['home/std-genset', catId]);

}
}
