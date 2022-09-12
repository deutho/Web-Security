import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private baseUrl = 'http://localhost:8080'; //set sanitization access here

  constructor(private http: HttpClient) { }

  upload(image: File): Observable<HttpEvent<any>> {

    const formdata: FormData = new FormData();

    formdata.append('file', image);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload`, formdata, { headers: new HttpHeaders({'Content-Type':'image/jpg'})});
    console.log(req.body)
    console.log(req)

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
