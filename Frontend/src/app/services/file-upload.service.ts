import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:8080'; //set sanitization access here

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {


    const formdata: FormData = new FormData();
    formdata.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formdata, {
      // headers: new HttpHeaders({'Content-Type': 'multipart/form-data'}),
      reportProgress: true,
      responseType: 'json'});

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
