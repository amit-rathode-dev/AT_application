import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainLayoutComponent } from './components/layout/main-layout/main-layout.component';
import { LoaderComponent } from './components/loader/loader.component';
// import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'lead-management';
  // constructor(private primengConfig: PrimeNGConfig) {}
  
ngOnInit() {
  // this.primengConfig.ripple = true; // Example of enabling ripple effect
}
}
