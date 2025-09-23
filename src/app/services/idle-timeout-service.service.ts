import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleTimeoutServiceService {
 private warningTimer: any;
  private logoutTimer: any;

  private readonly WARNING_MS = 25 * 60 * 1000; // 25 mins
  private readonly LOGOUT_MS = 30 * 60 * 1000;  // 30 mins

  constructor(
    private ngZone: NgZone,
    private auth: AuthService,
    private router: Router
  ) {
    this.startWatching();
  }

  private startWatching() {
    ['mousemove', 'keydown', 'click'].forEach(event =>
      window.addEventListener(event, () => this.resetTimers())
    );
    this.resetTimers();
  }

  private resetTimers() {
    clearTimeout(this.warningTimer);
    clearTimeout(this.logoutTimer);

    this.warningTimer = setTimeout(() => this.showWarning(), this.WARNING_MS);
    this.logoutTimer = setTimeout(() => this.forceLogout(), this.LOGOUT_MS);
  }

  private showWarning() {
    let secondsLeft = (this.LOGOUT_MS - this.WARNING_MS) / 1000;
    let timerInterval: any;

    Swal.fire({
      title: 'Session Expiring Soon',
      html: `You will be logged out in <b>${secondsLeft}</b> seconds.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Stay logged in',
      cancelButtonText: 'Log out now',
      allowOutsideClick: false,
      didOpen: () => {
        const el = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          secondsLeft--;
          if (el) el.textContent = String(secondsLeft);
        }, 1000);
      },
      willClose: () => clearInterval(timerInterval)
    }).then(result => {
      if (result.isConfirmed) {
        this.resetTimers(); // ✅ extend session locally
      } else {
        this.forceLogout();
      }
    });
  }

  private forceLogout() {
    this.auth.logout();
    Swal.fire('Logged out', 'Your session has expired due to inactivity.', 'info');
    this.router.navigate(['/login']);
  }
}