import { Component } from '@angular/core';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-view.component.html',
  styleUrl: './image-view.component.css'
})
export class ImageViewComponent {

  imageList!: Subscription;


  categoryImages: any = {};
  private subscriptions: Subscription[] = [];
  showPopup: boolean = false;
  public environment = environment.apiUrl;
  isCatTypeImage: boolean = false;


  constructor(private videoService: VideoplayerService, private router: Router) { }


  ngOnInit(): void {
    const imageList = this.videoService.imageListData$.subscribe(list => {
      this.categoryImages = list;

    });

    const isCatImageTypeSub = this.videoService.isCatImageType$.subscribe(flag => {
      this.isCatTypeImage = flag;
    });

    this.subscriptions.push(imageList, isCatImageTypeSub);

    console.log(this.categoryImages, '::::');
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeDialog() {
    this.videoService.closeVideoPlayer();
  }


}
