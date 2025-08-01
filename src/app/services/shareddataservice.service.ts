import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class ShareddataserviceService {

  constructor() { }

  private dataUpdatedSource = new Subject<void>();
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  notifyDataUpdate() {
    this.dataUpdatedSource.next();
  }
}
