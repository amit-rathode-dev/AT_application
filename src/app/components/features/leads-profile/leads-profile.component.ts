import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BadgeModule } from 'primeng/badge';
import { CommonService } from '../../../services/common.service';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';
import { Router } from '@angular/router';
import { VideoplayerService } from '../../../services/videoplayer.service';
import { Subscription } from 'rxjs/internal/Subscription';

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


interface Goem {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-leads-profile',
  standalone: true,
  imports: [CommonModule, CardModule,
    ButtonModule,
    BadgeModule,
  NoDataPipe
  ],
  templateUrl: './leads-profile.component.html',
  styleUrl: './leads-profile.component.css'
})


export class LeadsProfileComponent {


  selectedLead: Lead | null = null;
  role: string = '';
  role_id: string = '';
  user_id: string = '';
  userDetails: any;
  GoemData: any;
  leadsData: any[] = [];
  leadDetails: any;
  // isAsm:boolean=false;


  leads: any;

  private subscriptions = new Subscription();

  ngOnDestroy(): void {
  this.subscriptions.unsubscribe(); 
}


  constructor(public commonService: CommonService, private router: Router,private kgdDataService: VideoplayerService) {

  }

  ngOnInit() {
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      this.userDetails = JSON.parse(storedUserDetails); 
    } else {
      this.userDetails = {};
    }
    this.role = localStorage.getItem('role_name') ?? '';
    this.role_id = localStorage.getItem('user_role_id') ?? '';
    this.user_id = localStorage.getItem('user_id') ?? '';


    console.log(this.userDetails, 'here are userdetails from l0ocalstorage');

    this.getLeadData();

    // this.isAsm = this.role === 'ASM';

  }

  getLeadData() {


    
    const asm_id = this.userDetails?.user_id;
    const goem_id = 0;
    const kgd_id = 0;



    this.commonService.postDataWithBody('api/lead/getMyLeads', { asm_id, goem_id, kgd_id }).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
        
          this.GoemData = res.data.org
          this.leads = res.data.leads
          this.leadsData = res.data.leads
          if (this.leads?.length > 0) {
            this.selectedLead = this.leads[0]; 
            this.viewDetails(this.leads[0])
          }
          console.log('here are leads ----->', this.leads);

          console.log('here goem data', this.GoemData);


        } else {
      
        }
      },
      error: (err) => {
     
      }
    });
  }
  selectLead(lead: Lead) {
    console.log(lead, 'checking incoming id');
    console.log('lead hrtr data',lead.id);
    
    this.leadDetails = this.leadsData.filter((itr: any) => itr.id == lead.id);
    console.log(this.leadDetails, 'here the leads data');

  }

  goBack() {


  this.router.navigateByUrl('/home') 
 }

  viewDetails(lead: Lead) {
    this.selectLead(lead);
  }

showKGDData(goem:any) {
  console.log(goem,'here goem data');
   
  this.kgdDataService.shareData(goem);
  this.router.navigateByUrl('/home/kgd-data').then(success => {
    console.log('Navigation result:', success);
  }).catch(error => {
    console.error('Navigation error:', error);
  });
}

}
