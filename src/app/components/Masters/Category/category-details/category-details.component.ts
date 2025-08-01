import { Component } from '@angular/core';
import { VideoplayerService } from '../../../../services/videoplayer.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-details.component.html',
  styleUrl: './category-details.component.css'
})
export class CategoryDetailsComponent {


  videoListSub!: Subscription;


  categoryDetails: any = {};
  private subscriptions: Subscription[] = [];
  showPopup: boolean = false;
  public environment = environment.apiUrl;

  constructor(private videoService: VideoplayerService, private router: Router) { }


  ngOnInit(): void {
    const videoListSub = this.videoService.videoList$.subscribe(list => {
      this.categoryDetails = list;
      
    });

    this.subscriptions.push(videoListSub);
    console.log(videoListSub, 'videoListSub');
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  closeDialog() {
    this.videoService.closeVideoPlayer();
  }


}
