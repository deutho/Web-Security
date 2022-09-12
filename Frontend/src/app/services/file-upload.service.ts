import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:8080'; //set sanitization access here

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {


    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, file, { headers: new HttpHeaders({'Content-Type':'image/jpg'})});
    console.log(req.body)
    console.log(req)

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
