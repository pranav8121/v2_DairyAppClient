import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { HttpService } from '../http/http.service';
import { WebsocketserviceService } from '../Socketio/websocketservice.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
memberNo:any;
memberName:any;
billDetails:any;
  constructor(private router: Router, private webservice: WebsocketserviceService, private http: HttpService) { };
  clearUserDetails() {
    sessionStorage.removeItem("isUserLoggedIn");
    sessionStorage.removeItem('UId');
    sessionStorage.removeItem('Name');
    sessionStorage.removeItem('multi');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem("username");
  };

  Userlogin(userData: any, token: any) {
    const isUserLoggedIn: any = true;
    sessionStorage.setItem("isUserLoggedIn", isUserLoggedIn);
    sessionStorage.setItem("username", userData.username);
    sessionStorage.setItem('UId', userData._id);
    sessionStorage.setItem('Name', userData.Name);
    sessionStorage.setItem('multi', userData.multi);
    sessionStorage.setItem('token', token);
    this.router.navigate([`/DailyEntry`]);
    swal.fire({
      title: 'लॉगिन यशस्वी',
      text: '',
      icon: 'success',
    });
    let dataToSend = {
      msg: "success",
      token: token
    }
    // this.webservice.listen('testEvent').subscribe((data: any) => {
    //   this.webservice.emit('doneEvent', dataToSend);
    // });
  };

  UserLogout() {
    let token = this.getToken();
    let username = this.getUserName()
    let data = {
      username: username,
      token: token
    }
    this.http.postMethod('Login/logoutDairy', data).subscribe((res: any) => {
      if (res.result == 'Logout SuccessFully') {
        swal.fire({
          title: 'Logout SuccessFully',
          text: '',
          icon: 'success',
        });
        let dataToSend = {
          msg: "user logout",
          token: token
        }
        // this.webservice.emit('doneEvent', dataToSend);
        this.clearUserDetails();
        this.router.navigate([`/`]);
      }
      else {

      }
    })
  };

  getUId() {
    return sessionStorage.getItem('UId');
  };

  getDairyName() {
    return sessionStorage.getItem('Name');
  };

  getUserName() {
    return sessionStorage.getItem('username');
  };

  getToken() {
    return sessionStorage.getItem('token');
  };

  getMemberNo() {
    return this.memberNo;
  };
  
  getMemberName() {
    return this.memberName;
  };

  getBillDetails() {
    return this.billDetails;
  };

  setMemberName(val:any) {
    this.memberName=val;
  };

  setMemberNo(val:any) {
    this.memberNo=val;
  };

  setBillDetails(val:any) {
   this.billDetails=val;
  };
}
