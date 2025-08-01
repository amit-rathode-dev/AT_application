import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ModealHandlerService } from '../../shared/services/modeal-handler.service';
import { AuthRoutingModule } from "../../../auth/auth-routing.module";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AuthRoutingModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

bannerData:any[]=[]
  ngOninit(){

    // this.getBanner();
  }

  constructor(private commonService:CommonService,private modalHandler:ModealHandlerService){}

  // getBanner(){
  //   this.commonService.getAllData('api/banner/getBannerApi').subscribe({
  //     next:(res:any)=>{
  //       if(res.status==200 || res.status==201){
  //         this.getBanner=res.data
          
  //       }else{
  //           this.modalHandler.showError(res.message || 'banner data not found')
  //       }
  //     }
  //   })
  // }
}
