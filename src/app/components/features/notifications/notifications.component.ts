import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  org_id:any;
 notifications:any = [];

  constructor(private location: Location,private commonService:CommonService) {
    this.org_id =  Number(localStorage.getItem('org_id'));

  }
  ngOnInit(){
    this.getAllNotifications();
  }

  getAllNotifications() {
    const body = {
      "org_id":this.org_id,
      "media_type":"activity",
      "product_id" : 0
  }
    this.commonService.postDataWithBody('api/product/getMyMediaForMobileOrgBased', body).subscribe({
      next: (res: any) => {
        // console.log('Media Response:', res);
        // Handle the response here
        this.notifications=res.data.activity_link
      },
      error: (err: any) => {
        console.error('Error fetching media:', err);
        // Optionally show a toast or alert
      }
    });
  }
  goBack() {
    this.location.back();
  }
  formatToDayMonth(dateStr: string): string {
    // Convert string '04-05-2025 06:53:16' to Date
    const [day, month, yearWithTime] = dateStr.split('-');
    const [year, time] = yearWithTime.split(' ');
    const fullDate = new Date(`${year}-${month}-${day}T${time}`);
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short'
    };

    return fullDate.toLocaleDateString('en-US', options); // e.g., 4-May
  }
}