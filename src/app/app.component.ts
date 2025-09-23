import { Component, HostListener, NgZone } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LoaderComponent } from './components/loader/loader.component';
import { IdleTimeoutServiceService } from './services/idle-timeout-service.service';
import { AutologoutService } from './auth/services/autologout.service';
import Swal from 'sweetalert2';
// import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lead-management';
  private timeoutId: any;
  private readonly logoutTime = 15 * 60 * 1000; // 2 min
  private readonly warningTime = 5 * 1000;

  constructor(private router: Router) { }

  @HostListener('window:mousemove')
  @HostListener('window:mousedown')
  @HostListener('window:keypress')
  @HostListener('window:touchstart')
  @HostListener('window:click')
  resetTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }


    this.timeoutId = setTimeout(() => {
      this.showWarning();
    }, this.logoutTime - this.warningTime);
  }

  ngOnInit() {
    this.resetTimer();
  }

  private showWarning() {

    if (this.router.url.startsWith('/auth') || this.router.url.startsWith('/login')) {
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Session Timeout Warning',
      text: 'You will be logged out in 5 Sec  due to inactivity.',
      timer: this.warningTime,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    }).then(() => {
      this.autoLogout();
    });
  }

  private autoLogout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
}