import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FootearComponent } from '../footear/footear.component';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core'; 


@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule,RouterOutlet,HeaderComponent,FootearComponent,SideNavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

//   isSidebarVisible = true; 
//   isSidebarClose = false; 

//   constructor(private cdr: ChangeDetectorRef) {} 

//   toggleSidebar() {
//     this.isSidebarVisible = !this.isSidebarVisible;
//     this.isSidebarClose = !this.isSidebarClose; // Ensure toggle works immediately
//   }


  
//  onSidebarStateChange(isOpen: boolean) {
//   console.log("Sidebar State Changed:", isOpen);
//   this.isSidebarClose = !isOpen;

 
//   }



isSidebarVisible = true; // 🔥 Default: Sidebar Open
isSidebarClose = false;  // 🔥 Default: Sidebar Open (false means open)

toggleSidebar() {
  this.isSidebarVisible = !this.isSidebarVisible;
}

onSidebarStateChange(isOpen: boolean) {
  console.log("Sidebar State Changed:", isOpen);

  // 🔥 This will always toggle the class properly
  this.isSidebarClose = !isOpen;
}
  
}

