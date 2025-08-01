import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [    ButtonModule,
    RippleModule,
    RouterModule
],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
menuItems = [
  {
    image: 'assets/non-ad-profile_lead.svg',
    title: 'Leads',
    subtitle: 'Manage your leads',
    route:'/home/my-leads'
  },
  {
    image: 'assets/non-ad-accounts.svg',
    title: 'My Account',
    subtitle: 'Manage your account',
    route:'/home/my-Account'
  },
  {
    image: 'assets/non-ad-notifications.svg',
    title: 'Notifications',
    subtitle: 'Know notifications',
    route:'/home/notifications'
  },
  {
    image: 'assets/non-ad-privacy.svg',
    title: 'Privacy Policy',
    subtitle: 'Know privacy policy',
    route:'/home/'
  },
  {
    image: 'assets/logout.svg',
    title: 'Log Out',
    subtitle: 'Logging out',
    route:'/logout'
  }
];

}