import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  /**
   * API Endpoints
   */
  private middlewareUrl = 'http://localhost:8080';
  private backendURL = 'http://localhost:8081';

  constructor(private http: HttpClient) { }

  /**
   * Upload function using the sanitization API
   * @param file
   * @returns Promise of the Response (Error or Success)
   */
  async upload(file: File): Promise<any> {

    const formdata: FormData = new FormData();
    formdata.append('file', file);
    const req = new HttpRequest('POST', `${this.middlewareUrl}/sanitize`, formdata, {
      reportProgress: true,
      responseType: 'json'});

    return this.http.request(req).toPromise();
  }
  /**
   * Get All Files in the Database as RxJs Observable
   * @returns
   */
  getFiles(): Observable<any> {
    return this.http.get(`${this.backendURL}/files`)
  }
}
