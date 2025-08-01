import { Component } from '@angular/core';
import { VideoplayerService } from '../../../services/videoplayer.service';
import { CommonService } from '../../../services/common.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';

@Component({
  selector: 'app-filtered-kgds',
  standalone: true,
  imports: [CommonModule,FormsModule,NoDataPipe],
  templateUrl: './filtered-kgds.component.html',
  styleUrl: './filtered-kgds.component.css'
})
export class FilteredKgdsComponent {

selectedKgdId: string = '';
  selectedLead: any = null;

  kgdList = [
    { id: 'kgd1', name: 'KGD 1' },
    { id: 'kgd2', name: 'KGD 2' },
    { id: 'kgd3', name: 'KGD 3' },
    // Add more KGDs as needed
  ];


  allLeadsData = [
    {
      id: '1',
      leadid: 'KGD1234567',
      title: 'Mahesh Kale',
      mobile_no: '9135464767',
      status: 'Open',
      purchase_date: '2025-08-01',
      product_name: 'MHP',
      kvaRating: 'KOEL',
      fuel_name: 'Diesel',
      quantity: '02',
      firstName: 'Mahesh',
      lastName: 'Kale',
      email: 'maheshkale3455@gmail.com',
      company_name: 'Augmented Transformation PVT LTD',
      company_address: 'ABC city',
      state: 'Maharashtra',
      city: 'Pune',
      pincode: '410014',
      notes: 'Leave any note or request',
      kgdId: 'kgd1'
    },
    {
      id: '2',
      leadid: 'KGD1456789',
      title: 'Rajesh Jadhav',
      mobile_no: '9135464767',
      status: 'Open',
      purchase_date: '2025-08-01',
      product_name: 'MHP',
      kvaRating: 'KOEL',
      fuel_name: 'Diesel',
      quantity: '02',
      firstName: 'Rajesh',
      lastName: 'Jadhav',
      email: 'rajesh.jadhav@gmail.com',
      company_name: 'Augmented Transformation PVT LTD',
      company_address: 'ABC city',
      state: 'Maharashtra',
      city: 'Pune',
      pincode: '410014',
      notes: 'Urgent requirement',
      kgdId: 'kgd1'
    },
    // Add more leads with different kgdId values
  ];

  filteredLeadsData: any[] = [];
  kgdDataSub!: Subscription;
  kgdData: any;
  kgdsData: any
  kgdObjectData: any;
  kgdLeadsData: any[] = [];


    ngOnInit(): void {
     this.kgdDataSub = this.leadsdataservice.dataList$.subscribe(data => {
    if (Array.isArray(data)) {
      this.kgdData = data;
      console.log('KGD data received:', this.kgdData);

      if (this.kgdData.length > 0) {
        this.setFirstKgd(); // ✅ sets and triggers change
      }
    } else {
      this.kgdData = [];
      console.warn('Unexpected data type received:', typeof data);
    }
  });


    // if (this.kgdList.length > 0) {
    //   this.selectedKGD = this.kgdList[0].id;
    //   this.onKGDChange();
    // }
  }

 onKgdChange(org_id: string): void {
  this.getLeadData(org_id);
}


  selectLead(lead: any) {
    this.selectedLead = lead;
  }

  viewDetails(lead: any) {
    this.selectedLead = lead;
  }

  goBack() {
    // Handle back navigation
      this.router.navigateByUrl('/home/my-leads')
    console.log('Going back...');
  }


  constructor(private leadsdataservice: VideoplayerService, private commonService: CommonService, private kgdDataService: VideoplayerService, private router: Router) {

  }

setFirstKgd(): void {
  const first = this.kgdData[0];
  if (first) {
    this.selectedKgdId = first.org_id;
    this.onKgdChange(first.org_id); 

    this.getLeadData(first.org_id);
  }
}





  getLeadData(kgd_id: any) {

    this.commonService.postDataWithBody('api/lead/getMyLeads', { kgd_id}).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
        
          this.kgdLeadsData = res.data.leads

            if (this.kgdLeadsData?.length > 0) {
            this.selectedLead = this.kgdLeadsData[0]; 
            this.viewDetails(this.kgdLeadsData[0])
          }
          
          console.log('here are leads ----->', this.kgdLeadsData);

        } else {
        }
      },
      error: (err) => {
 
      }
    });
  }
}