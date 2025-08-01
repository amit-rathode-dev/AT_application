

import { Component, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../../shared/reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../../shared/commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonService } from '../../../../services/common.service';
import { max, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../../../shared/services/modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { environment } from '../../../../../environments/environment';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Router } from '@angular/router';
import { ViewMediComponent } from '../view-medi/view-medi.component';
import { NoDataPipe } from '../../../../helpers/pipes/no-data.pipe';
import { ContentMediaActionComponent } from '../content-media-action/content-media-action.component';


@Component({
  selector: 'app-content-manager-approval',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, NoDataPipe, ReactiveFormsModule, ReusablemodulesComponent, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, ViewMediComponent, ContentMediaActionComponent],
  templateUrl: './content-manager-approval.component.html',
  styleUrl: './content-manager-approval.component.css'
})
export class ContentManagerApprovalComponent {





  @ViewChild('dt') table!: Table;
  @ViewChild('commontable') commontable!: CommontableComponent;
  @ViewChild('fileUpload') fileUpload!: any;


  mediaData: any = [];
  incomingData: any = [];
  mediaIncomingData: any = []
  selectedData: any = [];
  rangesData: any[] = [];
  videoLinks: string[] = [];
  presentationList: any[] = [];
  catalogueList: any[] = [];
  videoList: any[] = [];
  imageList: any[] = []
  tableData: any[] = [];
  originalTableData: any[] = [];
  isvisible: boolean = false
  globalFilterValue: string = '';


  private environment = environment.apiUrl

  constructor(private fb: FormBuilder, private commonService: CommonService, private modelaHandler: ModealHandlerService, private videoService: VideoplayerService, private router: Router) {

    
  }


  ngOnInit() {

    this.getMediaData();
    this.approvalDialogCLose()

    this.videoService.showPopup$.subscribe(show => {
      this.isvisible = show;

    });

    this.videoService.approvalStatus.subscribe((changed) => {
      if (changed) {
        this.getMediaData(); 
           this.videoService.notifyApprovalChange(false);
      }
    });

  }


  getMediaData() {


    this.commonService.postDataWithBody('api/product/getAllMediaForPartnerForSuperUser', {}).subscribe({
      next: (res: any) => {
        if (res.status === 200 || res.status === 201) {
          const data = res.data;


          this.originalTableData = data
          // this.tableData = this.originalTableData.filter((item: any) => item.approval_status !== 'Uploaded');


          this.tableData = data.sort((a: any, b: any) => b.id - a.id);
          // this.tableData = data

        }
      }
    });
  }


  applyFilterGlobal(event: any, stringVal: string) {
    this.table.filterGlobal((event.target as HTMLInputElement).value, stringVal);
  }



  openFile(item: any): void {
    console.log('here is path', item);

    const filePath = item.file_path;
    const fileName = item.file_name || filePath.split('/').pop() || 'file';
    const fileUrl = `${environment.apiUrl}${filePath}`;

    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.warn('File URL not available.');
    }
  }


  openDetailPopup(item: any) {

    console.log(item, 'here is the item data');

    this.videoService.openVideoPlayer(item);
    this.isvisible = true

  }

  closeDialog() {
    this.isvisible = false
  }


  convertToFormattedDate(dateStr: string): Date {
    const [date, time] = dateStr.split(' ');
    const [day, month, year] = date.split('-');
    return new Date(`${year}-${month}-${day}T${time}`);
  }

  filterMediaType(mediaType: string) {
    console.log(mediaType, 'media type selected');

    if (mediaType === 'banner') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'banner');
    } else if (mediaType === 'flyer') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'flyer');
    } else if (mediaType === 'BTL Activity') {
      this.tableData = this.originalTableData.filter(item => item.media_type === 'BTL Activity');
    } else {
      // Reset to all data
      this.tableData = [...this.originalTableData];
    }
  }


  resetFilter(mediaType: string): void {
  this.globalFilterValue = ''; 
  this.table.clear(); 
 
    this.tableData = [...this.originalTableData];
  }


  getTextColor(status: string): string {
    const value = status?.toLowerCase();
    switch (value) {
      case 'rejected':
        return '#FF0000'; // red
      case 'pending':
        return '#C37C5A';
      case 'approved':
        return '#4DA023';
      case 'Uploaded':
        return '#219688ff';
      default:
        return '#000'; // fallback color
    }
  }



  approvalDialogCLose() {
    this.videoService.statusUpdated$.subscribe(() => {
      this.getMediaData();
      this.isvisible = false;
    });
  }

}
