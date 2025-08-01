import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }



getAllData(url: string): Observable<any> {
  return this.http.get<any>(`${environment.apiUrl + url}`);
}

getAllDataWithParams(url: string, params: any): Observable<any> {

  return this.http.get<any>(`${environment.apiUrl + url}`, { params });
}

getAllDataIdwise(url: string, ids: any[]) {
  const params = new HttpParams().set('id', ids.join(','));
  return this.http.get<any>(`${environment.apiUrl + url}`, { params });
}

postDataWithBody(url: string, payload: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl + url}`, payload);
}


getAllDatawithpathVariable(url: string, params : any): Observable<any> {

    return this.http.get<any>(`${environment.apiUrl + url}`, { params });
}


createData(url: string, payload: any): Observable<any> {
  return this.http.post<any>(`${environment.apiUrl + url}`, payload);
}

updateData(url: string, data: any): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl + url}`, data);
}

deleteData(url: string, id: number): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl}${url}${id}`);
}
getDataByPathVariable(url: string, id: number){
  return this.http.get<any>(`${environment.apiUrl}${url}${id}`);
}

deleteDataWithQueryParams(url: string, params: any): Observable<any> {
  return this.http.delete<any>(`${environment.apiUrl + url}`, { params });
}






   private videoListSource = new BehaviorSubject<string[]>([]);
  private showPopupSource = new BehaviorSubject<boolean>(false);

  videoList$ = this.videoListSource.asObservable();
  showPopup$ = this.showPopupSource.asObservable();


  openVideoPlayer(videoList: string[]) {
    this.videoListSource.next(videoList);
    this.showPopupSource.next(true);
  }

  closeVideoPlayer() {
    this.showPopupSource.next(false);
  }

}
