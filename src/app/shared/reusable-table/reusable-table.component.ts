
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-reusable-table',
  standalone: true,
  // imports: [],
    imports: [CommonModule, TableModule, ButtonModule], 
  templateUrl: './reusable-table.component.html',
  styleUrl: './reusable-table.component.css'
})
export class ReusableTableComponent {
  @Input() data: any[] = [];
  @Input() columns: { field: string; header: string }[] = [];
  @Input() globalFilterFields: string[] = [];
  @Input() enableCreate: boolean = false;
  @Input() title: string = '';
  @Input() rowsPerPageOptions: number[] = [10, 20, 50];
  @Input() rows: number = 10;

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  filterValue: string = '';

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value;
  }

  triggerCreate() {
    this.create.emit();
  }

  triggerEdit(row: any) {
    this.edit.emit(row);
  }

  triggerDelete(row: any) {
    this.delete.emit(row);
  }

}
