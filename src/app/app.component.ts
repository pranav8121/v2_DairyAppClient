import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from './Services/http/http.service';
import { NotifyService } from './Services/Notification/notify.service';
import { WebsocketserviceService } from './Services/Socketio/websocketservice.service';
import { UserService } from './Services/users/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Client';
  connection: boolean = false;
  constructor(private webservice: WebsocketserviceService,
    private user: UserService,
    private notify: NotifyService,
    private http: HttpService,
    private router: Router) {

  }
  ngOnInit() {
    // setTimeout(() => {
    //   let interval = setInterval(() => {
    //     if (sessionStorage.getItem('isUserLoggedIn')) {
    //       const data = {
    //         token: this.user.getToken()
    //       }
    //       this.http.postMethod('Login/checkUserLogin', data).subscribe((res: any) => {
    //         console.log("checked");

    //         this.notify.hideErrorToast()
    //         if (res.result == 0) {
    //           console.log(res.result);
    //           swal.fire({
    //             title: 'Login To Continue',
    //             text: '',
    //             icon: 'success',
    //           });
    //           clearInterval(interval)
    //           this.user.clearUserDetails();
    //           this.router.navigate([`/`]);
    //         }
    //       }, err => {
    //         console.log(err);
    //         this.notify.showErrorWithTimeout("Error in Connection", "");
    //       })
    //     }
    //   }, 1000);
    // }, 3000);
    setInterval(() => {
      if (sessionStorage.getItem('isUserLoggedIn')) {
        let data = {
          UId: sessionStorage.getItem('UId'),
          username: sessionStorage.getItem('username')
        }
        this.http.postMethod('Login/resetLoginCounter', data).subscribe()
      }
    }, 30000)

    if (!sessionStorage.getItem('isUserLoggedIn') && window.location.href.split("/").slice(-1)[0] != '') {
      swal.fire({
        title: 'Login to continue',
        text: '',
        icon: 'warning',
      });
      this.user.clearUserDetails();
      this.router.navigate([`/`]);
    }
    // Uncomment to setUp Socket.io

    // this.webservice.listen('testEvent').subscribe((data: any) => {
    //   let Login = sessionStorage.getItem('isUserLoggedIn');
    //   let token = this.user.getToken();

    //   let dataToSend = {
    //     msg: "success",
    //     token: this.user.getToken()
    //   };
    //   this.connection = true
    //   if (Login) {
    //     this.webservice.emit('doneEvent', dataToSend);
    //   } else {
    //     let dataToSend = {
    //       msg: "",
    //     }
    //     this.webservice.emit('doneEvent', dataToSend);
    //   };
    //   this.notify.hideErrorToast();
    // });

    // setTimeout(() => {
    //   if (!this.connection) {
    //     this.notify.showErrorWithTimeout("Error in Connection", "")
    //   }
    // }, 5000);
  }
  // 

}