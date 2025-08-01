import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from "primeng/dialog"
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { NoDataPipe } from '../../../helpers/pipes/no-data.pipe';

@Component({
  selector: 'app-reusablemodules',
  standalone: true,
  imports: [CommonModule,CardModule,ProgressBarModule,
    TooltipModule ,TableModule,
    ButtonModule,DropdownModule,DialogModule,ReactiveFormsModule,PaginatorModule,NoDataPipe],
  templateUrl: './reusablemodules.component.html',
  styleUrl: './reusablemodules.component.css'
})
export class ReusablemodulesComponent {

}
