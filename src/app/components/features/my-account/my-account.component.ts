import { Component } from '@angular/core';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css'
})
export class MyAccountComponent {
 userId:any;
 userData:any=[]
  constructor(private commonServise:CommonService){
this.userId=Number(localStorage.getItem('user_id'))
  }
  ngOnInit(){
    this.getuserData()
  }
  getuserData(){
    this.commonServise.getDataByPathVariable('api/user/getUserDetailsById/',this.userId).subscribe({
      next:(res:any)=>{
        this.userData=res.data
        // console.log(this.userData);
      },
      error:(err:any)=>{

      }
    })
  }
}
