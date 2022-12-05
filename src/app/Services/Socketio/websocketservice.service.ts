import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketserviceService {
  // socket: any;
  // readonly url: string = 'http://192.168.31.42:3001/';
  constructor() {
    // this.socket = io(this.url);
  }

  // listen(event: string) {
  //   console.log("listening");
  //   return new Observable((subscriber) => {
  //     this.socket.on(event, (data: any) => {
  //       subscriber.next(data);
  //     });
  //   });
  // }

  // emit(event: string, data: any) {
  //   if (sessionStorage.getItem('isUserLoggedIn')) {
  //     this.socket.emit(event, data);
  //   }
  // }
}
