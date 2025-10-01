import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { EncryptionService } from '../../../services/encryption.service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {


  isCollapsed = false;
  activeRoute: string = '';
  orgName: string | null = '';
  encryptedOrgName: string | null = '';
  roleName: string | null = '';
  encryptedRoleName: string | null = '';
  showMasterMenu: boolean = false;
  showSuperAdminMenu: boolean = false;
  showMediaMenu: boolean = false;
  showNonadminMenu: boolean = false;
  showNonAdminZsmMenu:boolean=false
  showContentData: boolean = false;
  organizationId: any;
  roleId: any;
  org_type:any;
  encryptedOrgType: string | null = '';


  @Output() sidebarStateChange = new EventEmitter<boolean>();

  constructor(private router: Router,private encryptionService:EncryptionService) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.urlAfterRedirects;
      }
    });
  }

  ngOnInit() {
    this.checkWindowWidth();

    // this.orgName = sessionStorage.getItem('org_name');

    // this.org_type = sessionStorage.getItem('org_type');
    // this.organizationId = sessionStorage.getItem('org_id');
    // this.roleName = sessionStorage.getItem('role_name');
    // this.roleId = sessionStorage.getItem('user_role_id')


        this.encryptedOrgName = sessionStorage.getItem('org_name');
       const orgName = this.encryptedOrgName ? this.encryptionService.getItem('org_name') : null;

       console.log(orgName,'decrypted org name in side nav');
       
    this.encryptedOrgType = sessionStorage.getItem('org_type');
    const orgType = this.encryptedOrgType ? this.encryptionService.getItem('org_type') : null;
    // this.org_type = sessionStorage.getItem('org_type');
    this.organizationId = sessionStorage.getItem('org_id');

    this.encryptedRoleName = sessionStorage.getItem('role_name');
    const roleName = this.encryptedRoleName ? this.encryptionService.getItem('role_name') : null;


    this.roleId = sessionStorage.getItem('user_role_id')



    // this.showSuperAdminMenu = this.orgName === 'KOEL' && this.roleName === 'Super Admin';
      this.showSuperAdminMenu = orgType === 'Self' && roleName === 'Super Admin';
    //  this.showMediaMenu = this.roleName !== 'super Admin' && this.orgName !== 'KOEL';
    this.showMediaMenu = roleName !== 'super Admin' && orgType !== 'Self';
    // this.showNonadminMenu = this.roleName != 'Super Admin' && this.orgName == 'KOEL';
    // this.showNonadminMenu =
    //   ['asm','zsm', 'rsm', 'sales'].includes((this.roleName || '').toLowerCase()) &&
    //   this.orgName === 'KOEL';
        this.showNonadminMenu =
      ['asm','zsm', 'rsm', 'sales'].includes((roleName || '').toLowerCase()) &&
      orgType === 'Self';
      // this.showNonAdminZsmMenu=['zsm'].includes((this.roleName || '').toLocaleLowerCase()) && this.orgName ==='KOEL';
    this.showNonAdminZsmMenu=['zsm'].includes((roleName || '').toLocaleLowerCase()) && orgType ==='Self';

  // this.showContentData = this.roleName === 'Content Manager' && this.orgName === 'KOEL';
this.showContentData = this.roleName === 'Content Manager' && orgType === 'Self';

  }

  menuItems = [
    { label: "Dashboard", icon: "pi pi-home", routerLink: ["/dashboard"] },
    { label: "Users", icon: "pi pi-users", routerLink: "/user-roles" },
    { label: "Reports", icon: "pi pi-chart-bar", routerLink: ["/reports"] },
    { label: "Settings", icon: "pi pi-cog", routerLink: ["/settings"] },
    { label: "home", icon: "pi pi-cog", routerLink: ["/home"] },
  ];


  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    setTimeout(() => {
      this.sidebarStateChange.emit(!this.isCollapsed);
    }, 0);
  }

  setActive(route: string) {
    this.activeRoute = route;
  }

  isMasterMenuOpen = false;
  // activeRoute = ''; // set this using Router events or manually

  toggleMasterMenu() {
    this.isMasterMenuOpen = !this.isMasterMenuOpen;
  }

  isMasterOpen = false;


  isRouteUnderMaster(): boolean {
    return [
      '/org',
      '/role-management',
      '/banner',
      '/category',
      '/fuel',
      '/product-ranges',
      '/products',
      '/variant',


    ].includes(this.activeRoute);
  }


  toggleMaster() {
    this.isMasterOpen = !this.isMasterOpen;
  }



  @HostListener('window:resize', [])
  onWindowResize() {
    this.checkWindowWidth();
  }

  checkWindowWidth() {
    if (window.innerWidth <= 991) {

      this.isMasterMenuOpen = false;
    }
  }

}


// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, HostListener, Output } from '@angular/core';
// import { NavigationEnd, Router, RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-side-nav',
//   standalone: true,
//   imports: [RouterLink, CommonModule],
//   templateUrl: './side-nav.component.html',
//   styleUrl: './side-nav.component.css'
// })
// export class SideNavComponent {


//   isCollapsed = false;
//   activeRoute: string = '';
//   orgName: string | null = '';
//   roleName: string | null = '';
//   showMasterMenu: boolean = false;
//   showSuperAdminMenu: boolean = false;
//   showMediaMenu: boolean = false;
//   showNonadminMenu: boolean = false;
//   showNonAdminZsmMenu:boolean=false
//   showContentData: boolean = false;
//   organizationId: any;
//   roleId: any;
//   org_type:any;


//   @Output() sidebarStateChange = new EventEmitter<boolean>();

//   constructor(private router: Router) {

//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         this.activeRoute = event.urlAfterRedirects;
//       }
//     });
//   }

//   ngOnInit() {
//     this.checkWindowWidth();

//     this.orgName = sessionStorage.getItem('org_name');
//     this.org_type = sessionStorage.getItem('org_type');
//     this.organizationId = sessionStorage.getItem('org_id');
//     this.roleName = sessionStorage.getItem('role_name');
//     this.roleId = sessionStorage.getItem('user_role_id')


//     // this.showSuperAdminMenu = this.orgName === 'KOEL' && this.roleName === 'Super Admin';
//       this.showSuperAdminMenu = this.org_type === 'Self' && this.roleName === 'Super Admin';
//     //  this.showMediaMenu = this.roleName !== 'super Admin' && this.orgName !== 'KOEL';
//     this.showMediaMenu = this.roleName !== 'super Admin' && this.org_type !== 'Self';
//     // this.showNonadminMenu = this.roleName != 'Super Admin' && this.orgName == 'KOEL';
//     // this.showNonadminMenu =
//     //   ['asm','zsm', 'rsm', 'sales'].includes((this.roleName || '').toLowerCase()) &&
//     //   this.orgName === 'KOEL';
//         this.showNonadminMenu =
//       ['asm','zsm', 'rsm', 'sales'].includes((this.roleName || '').toLowerCase()) &&
//       this.org_type === 'Self';
//       // this.showNonAdminZsmMenu=['zsm'].includes((this.roleName || '').toLocaleLowerCase()) && this.orgName ==='KOEL';
//     this.showNonAdminZsmMenu=['zsm'].includes((this.roleName || '').toLocaleLowerCase()) && this.org_type ==='Self';

//   // this.showContentData = this.roleName === 'Content Manager' && this.orgName === 'KOEL';
// this.showContentData = this.roleName === 'Content Manager' && this.org_type === 'Self';

//   }

//   menuItems = [
//     { label: "Dashboard", icon: "pi pi-home", routerLink: ["/dashboard"] },
//     { label: "Users", icon: "pi pi-users", routerLink: "/user-roles" },
//     { label: "Reports", icon: "pi pi-chart-bar", routerLink: ["/reports"] },
//     { label: "Settings", icon: "pi pi-cog", routerLink: ["/settings"] },
//     { label: "home", icon: "pi pi-cog", routerLink: ["/home"] },
//   ];


//   toggleSidebar() {
//     this.isCollapsed = !this.isCollapsed;
//     setTimeout(() => {
//       this.sidebarStateChange.emit(!this.isCollapsed);
//     }, 0);
//   }

//   setActive(route: string) {
//     this.activeRoute = route;
//   }

//   isMasterMenuOpen = false;
//   // activeRoute = ''; // set this using Router events or manually

//   toggleMasterMenu() {
//     this.isMasterMenuOpen = !this.isMasterMenuOpen;
//   }

//   isMasterOpen = false;


//   isRouteUnderMaster(): boolean {
//     return [
//       '/org',
//       '/role-management',
//       '/banner',
//       '/category',
//       '/fuel',
//       '/product-ranges',
//       '/products',
//       '/variant',


//     ].includes(this.activeRoute);
//   }


//   toggleMaster() {
//     this.isMasterOpen = !this.isMasterOpen;
//   }



//   @HostListener('window:resize', [])
//   onWindowResize() {
//     this.checkWindowWidth();
//   }

//   checkWindowWidth() {
//     if (window.innerWidth <= 991) {

//       this.isMasterMenuOpen = false;
//     }
//   }

// }