import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate, post-check=0, pre-check=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  APIHost = "http://192.168.1.152:3001/";
  str_apiLink = 'http://192.168.1.152:3001/API/';
  // str_apiLink = 'http://192.168.31.134:3001/API/';
  constructor(public http: HttpClient) { }


  getMethod(link: any) {
    return this.http.get(this.str_apiLink + link, { headers: this.headers });
  }


  postMethod(link: any, data: any) {
    return this.http.post(this.str_apiLink + link, data, { headers: this.headers });
  }

  putMethod(link: any, data: any) {
    return this.http.put(this.str_apiLink + link, data);
  }


}
