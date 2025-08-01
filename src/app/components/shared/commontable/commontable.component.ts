import { Component } from '@angular/core';



import {  Input, Output, EventEmitter, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { TableModule } from "primeng/table"
import { ButtonModule } from "primeng/button"
import { InputTextModule } from "primeng/inputtext"
import { PaginatorModule } from "primeng/paginator"
import { TooltipModule } from "primeng/tooltip"
import { Router } from '@angular/router';



export interface TableColumn {
  field: string
  header: string
  sortable?: boolean
  width?: string
}

export interface TableAction {
  icon: string
  tooltip: string
  class?: string
  action: (item: any) => void
}



@Component({
  selector: 'app-commontable',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, PaginatorModule, TooltipModule],
  templateUrl: './commontable.component.html',
  styleUrl: './commontable.component.css'
})
export class CommontableComponent   implements OnInit {



 
  @Input() columns: TableColumn[] = []
  @Input() data: any[] = []
  @Input() title = ""
  @Input() actions: TableAction[] = []
  @Input() loading = false
  @Input() paginator = true
  @Input() rows = 10
  @Input() totalRecords = 0
  @Input() rowsPerPageOptions: number[] = [5, 10, 25, 50]
  @Input() showCurrentPageReport = true
  @Input() currentPageReportTemplate = "Showing {first} to {last} of {totalRecords} entries"
  @Input() globalFilterFields: string[] = []

  
  @Output() onCreate: EventEmitter<void> = new EventEmitter<void>();
  @Output() onPage = new EventEmitter<any>()
  @Output() onSort = new EventEmitter<any>()
  @Output() onFilter = new EventEmitter<any>()

  filteredData: any[] = []
  globalFilterValue = ""
  first = 0
  visible: boolean=false;

  ngOnInit(): void {
    this.filteredData = [...this.data]
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase()
    this.globalFilterValue = filterValue

    if (filterValue) {
      this.filteredData = this.data.filter((item) => {
        return this.globalFilterFields.some((field) => {
          const value = this.getNestedPropertyValue(item, field)
          return value && value.toString().toLowerCase().includes(filterValue)
        })
      })
    } else {
      this.filteredData = [...this.data]
    }

    this.onFilter.emit({
      filteredValue: this.filteredData,
      filters: { global: { value: filterValue, matchMode: "contains" } },
    })
  }

  getNestedPropertyValue(obj: any, path: string): any {
    return path.split(".").reduce((o, p) => (o ? o[p] : null), obj)
  }

  onPageChange(event: any): void {
    this.first = event.first
    this.onPage.emit(event)
  }

  onSortChange(event: any): void {
    this.onSort.emit(event)
  }

  handleCreate(): void {
    this.onCreate.emit()
  }

  executeAction(action: TableAction, item: any): void {
    action.action(item)
  }

  clearFilter(): void {
    this.globalFilterValue = ""
    this.filteredData = [...this.data]
    this.onFilter.emit({
      filteredValue: this.filteredData,
      filters: {},
    })
  }


  openDialog(){
    this.visible=true;
  }


  handleCreateClick() {
    this.onCreate.emit();
  }
}

