import { Component } from '@angular/core';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';


@Component({
  selector: 'app-content-media-action',
  standalone: true,
  imports: [FormsModule, CommonModule],

  templateUrl: './content-media-action.component.html',
  styleUrl: './content-media-action.component.css'
})
export class ContentMediaActionComponent {
showPopup: boolean = false;
  mediaData: any = {};
  selectedStatus: string = '';
  status: string = '';
  showTextarea: boolean = false;
  rejectionReason: string = '';
  userRole: string = '';
  organizationName: string = '';
  contentManager: boolean = false;



  public environment = environment.apiUrl
  constructor(private mediaService: VideoplayerService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private commonService: CommonService, private modalHandler: ModealHandlerService) {

  }

  ngOnInit() {

    this.userRole = localStorage.getItem('role_name') || '';
    this.organizationName = localStorage.getItem('org_name') || '';

          
      const role = this.userRole.toLowerCase();
      const org = this.organizationName.toLowerCase();

      this.contentManager = role === 'content manager' && org === 'koel';


    this.mediaService.videoList$.subscribe(list => {
      this.mediaData = list;

      console.log('media data->', this.mediaData);
    });


  }
  // onStatusChange(value: string) {
  //   this.status = value;
  //   this.showTextarea = value === 'reject';
  // }

  // onStatusChange(value: string) {
  //   console.log('Status changed to:', value);
  //   this.status = value;
  //   this.showTextarea = value.toLowerCase() === 'reject';

  // }


  onSubmit() {

    console.log('Submitted status:', this.selectedStatus);
    const userId = localStorage.getItem('user_id') || '';
    const payload = {
      id: this.mediaData?.id,
      special_user_status: this.selectedStatus,
      special_user_action_by: Number(userId),
      approval: 'Super_Admin',
      special_user_reason: this.selectedStatus === 'Rejected' ? this.rejectionReason : null,
          
     
    };

    console.log(payload, 'payload------>');



    this.commonService.updateData('api/product/updateStatusForMediaForPartner', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.modalHandler.showToast(res.message || 'Status Has been updated')

          this.videoService.notifyStatusUpdated();
            this.videoService.notifyApprovalChange(true);
            // setTimeout(() => window.location.reload(), 2000);
          this.closeDialog()

        } else {
          this.modalHandler.showError(res.message || 'Status Update Errorj')
        }
      }
    })

  }


  statusClassMap = {
    pending: 'status-pending',
    reject: 'status-reject',
    rejected: 'status-reject',
    approved: 'status-approved',
    uploaded: 'status-uploaded',
  };

  closeDialog() {
    this.videoService.closeVideoPlayer();
    
  }


  onStatusChange(value: string): void {
  this.selectedStatus = value;
  this.showTextarea = value.toLowerCase() === 'rejected'
  // this.showTextarea = value.toLowerCase() === 'rejected' || value.toLowerCase() === 'approved';
}
}
