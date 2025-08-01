import { Component } from '@angular/core';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CommonService } from '../../../../services/common.service';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { NoDataPipe } from '../../../../helpers/pipes/no-data.pipe';

@Component({
  selector: 'app-view-medi',
  standalone: true,
  imports: [FormsModule, CommonModule, NoDataPipe],
  templateUrl: './view-medi.component.html',
  styleUrl: './view-medi.component.css'
})
export class ViewMediComponent {

  showPopup: boolean = false;
  mediaData: any = {};
  selectedStatus: string = '';
  status: string = '';
  showTextarea: boolean = false;
  reason: string = '';
  userRole: string = '';
  organizationName: string = '';



  public environment = environment.apiUrl
  constructor(private mediaService: VideoplayerService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private commonService: CommonService, private modalHandler: ModealHandlerService) {

  }

  ngOnInit() {

    this.userRole = localStorage.getItem('role_name') || '';
    this.organizationName = localStorage.getItem('org_name') || '';

    this.mediaService.videoList$.subscribe(list => {
      this.mediaData = list;

      console.log('media data->', this.mediaData);


    });


  }


  onStatusChange(value: string) {
    console.log('Status changed to:', value);
    this.status = value;
    this.showTextarea = value.toLowerCase() === 'rejected' ;

  }


  onSubmit() {

    console.log('Submitted status:', this.selectedStatus);
    const userId = localStorage.getItem('user_id') || '';
    const payload = {
      id: this.mediaData?.id,
      admin_status: this.selectedStatus,
      admin_action_by: userId,
      approval: 'Admin',
      admin_reason: this.selectedStatus === 'Rejected'?this.reason:null,
      // type: this.mediaData?.media_type
    };

    console.log(payload, 'payload------>');



    this.commonService.updateData('api/product/updateStatusForMediaForPartner', payload).subscribe({
      next: (res: any) => {
        if (res.status == 200 || res.status == 201) {
          this.modalHandler.showToast(res.message || 'Status Has been updated')
            this.videoService.notifyStatusUpdated();
          this.closeDialog()
          this.videoService.notifyApprovalChange(true);
              // setTimeout(() => window.location.reload(), 3000);

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
}
