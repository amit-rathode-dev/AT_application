import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';
import { VideoplayerService } from '../../../services/videoplayer.service';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  status: string;
  category_id: string;
  category_name: string;
  city: string;
  company_address: string;
  company_name: string | null;
  created_at: string;
  created_by: string;
  email: string;
  fuel_id: string;
  fuel_name: string;
  geo_location: string;
  goem_id: string | null;
  goem_name: string | null;
  kgd_id: string | null;
  kgd_name: string | null;
  lat: number;
  leadid: string | null;
  long: number;
  mobile_no: string;
  notes: string;
  pincode: string;
  product_id: string;
  product_name: string;
  purchase_date: string;
  quantity: string;
  state: string;
  status_id: string;
  title: string;
}

@Component({
  selector: 'app-kgd-data',
  standalone: true,
  imports: [CommonModule, CardModule,
     ButtonModule,
     BadgeModule,
   NoDataPipe
   ],
  templateUrl: './kgd-data.component.html',
  styleUrl: './kgd-data.component.css'
})

export class KgdDataComponent {



leadsData: any[] = [];
  leadsDataSub!: Subscription;
  GoemData: any;
  subscription!: Subscription;
  tempkgdData:any[]=[]
  templeadsData:any[]=[]
  leadasObjData:any;
  filteredLeadsData:any;

  leadData:any;


   selectedLead: Lead | null = null
private subscriptions = new Subscription();


ngOnDestroy(): void {
  this.subscriptions.unsubscribe(); // Automatically unsubscribes from all
}



  ngOnInit(){
      this.leadsDataSub= this.leadsdataservice.dataList$.subscribe(data => {
        if (Array.isArray(data)) {
      this.leadsData = data;
    } else if (data && typeof data === 'object') {
      this.leadData = Object.values(data); 
      this.leadasObjData=this.leadData
      console.log('here again cgeck',this.leadasObjData[1]);
       // get array of values from object
    } else {
      this.leadsData = [];
      console.warn('Unexpected data type received:', typeof data);
    }
    }); 

    // console.log('here adaa',this.leadsDataSub[1]);

    const goem_id=this.leadasObjData[0];

      this.getLeadData(goem_id);
    
  }



  
  goBack() {
    
    this.router.navigateByUrl('/home/my-leads');
  }

  constructor(private leadsdataservice:VideoplayerService,private commonService:CommonService,private kgdDataService: VideoplayerService,private router:Router){

  }



  
  getLeadData(goem_id?: any) {

    console.log('here get the leads data',this.leadData);

    if(!goem_id){
      this.templeadsData=[];
    }

    
  
    // const goem_id = 0;
    // const kgd_id = 0;

    this.templeadsData=[];

    this.commonService.postDataWithBody('api/lead/getMyLeads', { goem_id}).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
        
          this.tempkgdData = res.data.org
          this.templeadsData = res.data.leads
          this.leadsData = res.data.leads
          if (this.templeadsData?.length > 0) {
            this.selectedLead = this.templeadsData[0]; 
            this.viewDetails(this.templeadsData[0])
          }
          console.log('here are leads ----->', this.templeadsData);

          console.log('here goem data', this.tempkgdData);


        } else {
          // handle error
        }
      },
      error: (err) => {
        // handle HTTP error
      }
    });
  }


    selectLead(lead: Lead) {
    console.log(lead, 'checking incoming id');
    console.log('lead hrtr data',lead.id);
    
    this.filteredLeadsData = this.templeadsData.filter((itr: any) => itr.id == lead.id);
    console.log(this.filteredLeadsData, 'here the leads data');

  }

  
  // viewDetails(lead: Lead) {
  //   this.selectLead(lead);
  // }
  
   viewDetails(templeadsData: any) {
    this.selectLead(templeadsData);
  }


  showKGDData() {
  // console.log(goem,'here goem data');
  
   
  this.kgdDataService.shareData(this.tempkgdData);
  this.router.navigateByUrl('/home/kgd-details').then(success => {
    console.log('Navigation result:', success);
  }).catch(error => {
    console.error('Navigation error:', error);
  });
}

}
