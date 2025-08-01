import { Component, ElementRef, HostListener, Input, ViewEncapsulation } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


import { CommonModule } from '@angular/common';
import { model, ViewChild } from '@angular/core';
import { ReusablemodulesComponent } from '../../reusablemodules/reusablemodules.component';
import { CommontableComponent, TableAction, TableColumn } from '../../commontable/commontable.component';
import { DropdownModule } from 'primeng/dropdown';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
// import { CommonService } from '../../services/common.service';
import { max, Observable, of, Subscription, TimeoutError } from 'rxjs';
import Swal from 'sweetalert2';
import { ModealHandlerService } from '../modeal-handler.service';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { TabViewModule } from 'primeng/tabview';
import { GalleriaModule } from 'primeng/galleria';
// import { VideoPlayerService } from '../../services/video-player.service';
import { CommonService } from '../../../../services/common.service';
import { ProductComponent } from '../../../Masters/product/product.component';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Router } from '@angular/router';

interface VideoItem {
  file_name: string;
  video_link: string;
}
declare var YT: any;

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, FileUploadModule, ToastModule, GalleriaModule, ReusablemodulesComponent, TabViewModule, DropdownModule, TableModule, DialogModule, ReactiveFormsModule, ReusablemodulesComponent, PaginatorModule, MultiSelectModule, TableModule, ProductComponent],
  templateUrl: './videoplayer.component.html',
  styleUrl: './videoplayer.component.css',
  encapsulation: ViewEncapsulation.None
})
export class VideoplayerComponent {


  videoList: { file_name: string; video_link: string }[] = [];


  currentVideo!: { file_name: string; video_link: string };
  
  ytPlayer: any;
  @ViewChild('ytPlayerContainer', { static: false }) ytPlayerContainer!: ElementRef;
    @ViewChild('videoIframe') videoIframe!: ElementRef;


  subscriptions: Subscription[] = [];
  showPopup = false;
  isPlaying = false;
  isMuted = false;
  isFullScreen = false;
  videopathLink:any
  constructor(
    private videoService: VideoplayerService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { }

  ngOnInit(): void {
    const videoListSub = this.videoService.videoList$.subscribe((list: string[]) => {
      console.log(list, 'incoming video list');
      
      this.videoList = list.map(url => ({
        file_name: this.extractFileName(url), 
        video_link: url
      }));

      console.log(this.videoList, 'videoList::::::');

      if (this.videoList && this.videoList.length > 0) {
        this.currentVideo = this.videoList[0];


      }
      // this.sanitizeVideoUrl(this.videoList[0])
    });

    this.subscriptions.push(videoListSub);
  }

  extractFileName(url:any): string {
    console.log('urlincojjsncs', url);
    
      return url?.file_name?.trim() || 'Unnamed Video';
  
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // sanitizeVideoUrl(videoObject: { file_name: string; video_link: string }) {
  //   console.log(videoObject, 'videoObject::::::');

  //   console.log(videoObject.video_link, 'video link::::::');
    
    
  //   const videoId = this.getVideoId(videoObject.video_link);
  //    this.videopathLink=this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  // }

  sanitizeVideoUrl(videoObject: { file_name: string; video_link: string }): SafeResourceUrl {
    console.log(videoObject, 'videoObject::::::');

    console.log(videoObject.video_link, 'video link::::::');
    
    
    const videoId = this.getVideoId(videoObject.video_link);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }




  playVideo(index: number): void {
    this.currentVideo = this.videoList[index];
  }


  getVideoId(url: any): string {
    console.log(url, 'incoming url');
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^\s&]+)/;
    const match = url.video_link.match(regex);
    return match ? match[1] : '';
  }

  getVideoThumbnail(url: string): string {
    const videoId = this.getVideoId(url);
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  openVideoModal(): void {
    this.showPopup = true;
  }

  closeDialog(): void {
    this.videoService.closeVideoPlayer();
  }


   playFullscreenVideo(video: { file_name: string; video_link: string }): void {
    const videoId = this.getVideoId(video.video_link);

    if ((window as any).YT && YT.Player) {
      this.initializePlayer(videoId);
    } else {
      (window as any).onYouTubeIframeAPIReady = () => {
        this.initializePlayer(videoId);
      };
    }
  }

  initializePlayer(videoId: string): void {
    if (this.ytPlayer) {
      this.ytPlayer.loadVideoById(videoId);
      this.ytPlayer.playVideo();
      this.requestFullScreen(this.ytPlayer.getIframe());
      return;
    }

    this.ytPlayer = new YT.Player('yt-fullscreen-player', {
      height: '390',
      width: '640',
      videoId,
      events: {
        onReady: (event: any) => {
          const iframe = event.target.getIframe();
          this.requestFullScreen(iframe);
          event.target.playVideo();
        }
      }
    });
  }

  requestFullScreen(element: HTMLElement): void {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).mozRequestFullScreen) {
      (element as any).mozRequestFullScreen();
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen();
    }
  }

   openFullscreen(): void {
    const iframe: any = this.videoIframe?.nativeElement;
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    } else if (iframe.webkitRequestFullscreen) {
      iframe.webkitRequestFullscreen();
    } else if (iframe.mozRequestFullScreen) {
      iframe.mozRequestFullScreen();
    } else if (iframe.msRequestFullscreen) {
      iframe.msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  }

  onVideoDoubleClick(): void {
    this.closeFullscreen();
  }

  @HostListener('document:fullscreenchange', [])
  @HostListener('document:webkitfullscreenchange', [])
  @HostListener('document:mozfullscreenchange', [])
  @HostListener('document:MSFullscreenChange', [])
  onFullScreenChange() {
    this.isFullScreen = !!document.fullscreenElement;
    console.log('Fullscreen state changed:', this.isFullScreen);
  }

}