import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private middlewareUrl = 'http://localhost:8080'; //set sanitization access here
  private backendURL = 'http://localhost:8081'; //set backend access here

  constructor(private http: HttpClient) { }

  async upload(file: File): Promise<any> {


    const formdata: FormData = new FormData();
    formdata.append('file', file);

    const req = new HttpRequest('POST', `${this.middlewareUrl}/sanitize`, formdata, {
      // headers: new HttpHeaders({'Content-Type': 'multipart/form-data'}),
      reportProgress: true,
      responseType: 'json'});

    return this.http.request(req).toPromise();
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.backendURL}/files`);
  }
}
