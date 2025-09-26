import { Injectable, NgZone } from '@angular/core';
import { fromEvent, merge, Subscription, timer } from 'rxjs';

import { AuthService } from './auth.service';
import { ModealHandlerService } from '../../components/shared/services/modeal-handler.service';  
import Swal from 'sweetalert2';
import { switchMap } from 'rxjs/operators';





@Injectable({
  providedIn: 'root'
})
export class AutologoutService {

  private readonly idleTime = 1 * 60 * 1000; 
  private readonly warningTime = 0 * 60 * 1000; 

  private idleSub?: Subscription;

  constructor(
    private auth: AuthService,
    private modal: ModealHandlerService,
    private ngZone: NgZone
  ) {
    this.initListener();
  }

  private initListener() {
    this.ngZone.runOutsideAngular(() => {
      const activity$ = merge(
        fromEvent(document, 'mousemove'),
        fromEvent(document, 'click'),
        fromEvent(document, 'keypress'),
        fromEvent(document, 'touchstart')
      );

       this.idleSub = activity$
      .pipe(switchMap(() => timer(this.idleTime - this.warningTime)))
      .subscribe(() => this.showWarning());
  });
  }


private showWarning() {
  this.ngZone.run(() => {
    Swal.fire({
      title: 'Inactive!',
      text: 'You will be logged out in 1 minute due to inactivity.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Stay Logged In',
      cancelButtonText: 'Logout Now',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to stay logged in → reset timer
        this.resetTimer();
      } else {
        // User chose logout or closed modal
        this.logout();
      }
    });

    // Automatic logout after warningTime (1 minute)
    timer(this.warningTime).subscribe(() => {
      // Check if Swal is still open
      if (Swal.isVisible()) {
        this.logout();
        Swal.close();
      }
    });
  });
}

  private logout() {
    this.auth.logout(); 
  }

  
resetTimer() {
  // unsubscribe previous timer
  this.idleSub?.unsubscribe();
  // reinitialize listener
  this.initListener();
}

}
