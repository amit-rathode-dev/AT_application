import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoplayerService {
  [x: string]: any;

  constructor() {

    this.channel = new BroadcastChannel('media-update-channel');

    // Listen for messages from other tabs
    this.channel.onmessage = (message) => {
      if (message.data === 'statusUpdated') {
        this.statusUpdateSource.next(); // 🔁 Trigger observable
      }
    };


  }

  private videoListSource = new BehaviorSubject<string[]>([]);
    private SharedDataSource = new BehaviorSubject<string[]>([]);
  private imageListSource = new BehaviorSubject<string[]>([]); // Reusing videoListSource for image data
  private showPopupSource = new BehaviorSubject<boolean>(false);

  private statusUpdateSource = new Subject<void>();
  statusUpdated$ = this.statusUpdateSource.asObservable();

  videoList$ = this.videoListSource.asObservable();
  dataList$=this.SharedDataSource.asObservable();

  imageListData$ = this.imageListSource.asObservable(); // Reusing videoListSource for image data

  showPopup$ = this.showPopupSource.asObservable();

  private channel: BroadcastChannel;


  private approvalStatus$ = new BehaviorSubject<boolean>(false);
  approvalStatus = this.approvalStatus$.asObservable();



  private isCatImageTypeSource = new BehaviorSubject<boolean>(false);
  isCatImageType$ = this.isCatImageTypeSource.asObservable();

  openVideoPlayer(videoList: string[]) {
    console.log(videoList, 'videoList------>');

    this.videoListSource.next(videoList);
    this.showPopupSource.next(true);
  }

  shareImages(imageListData: string[], categoryTypeImage: boolean) {
    console.log(imageListData, 'videoList------>');

    console.log(categoryTypeImage, 'isCatImageType------>');


    this.imageListSource.next(imageListData);
    this.isCatImageTypeSource.next(categoryTypeImage);
    this.showPopupSource.next(true);

  }

  closeVideoPlayer() {
    this.videoListSource.next([]);
    this.showPopupSource.next(false);
    this.imageListSource.next([]);
    this.showPopupSource.next(false)

  }

  closeImagePlayer() {
    this.imageListSource.next([]);
    this.showPopupSource.next(false);
  }

  addFormData() {

  }


  notifyStatusUpdated() {
    console.log('[Partner] Notifying status update to other tabs');
    this.statusUpdateSource.next();
    this.channel.postMessage('statusUpdated');
  }

    shareData(dataList: any[]) {
    console.log(dataList, 'data------>');

    this.SharedDataSource.next(dataList);
    // this.showPopupSource.next(true);
  }

   notifyApprovalChange(value: boolean = true) {
    this.approvalStatus$.next(value);
  }
}
