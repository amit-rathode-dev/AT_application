import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restricted',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restricted.component.html',
  styleUrl: './restricted.component.css'
})
export class RestrictedComponent {

  ngOnInit(): void {
      const role=localStorage.getItem('role_name');
       const org=localStorage.getItem('org_name');
  }
}
