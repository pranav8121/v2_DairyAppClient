import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  toastInfoRef:any;
  toastErrorRef:any;
  toastSuccessRef:any;
  constructor(private toastr: ToastrService) { }
  //*********************************************************************************** */
  showSuccessWithTimeout(message:any, title:any) {
    // this.toastr.success("I'm a toast!", "Success!")
    // console.log("Notify");
    this.toastSuccessRef = this.toastr.success(message, title, {
      disableTimeOut: false,
      tapToDismiss: false,
      progressBar: false,
      progressAnimation:'increasing'
    })
  }
  hideSuccessToast() {
    if (typeof (this.toastSuccessRef) == 'object') {
      this.toastr.clear(this.toastSuccessRef.ToastId)
    }
  }
  //*********************************************************************************** */
  showInfoWithTimeout(message:any, title:any) {
    this.toastInfoRef = this.toastr.info(message, title, {
      disableTimeOut: true,
      tapToDismiss: false,
      progressBar: false,
      progressAnimation:'increasing'
    })
  }
  hideInfoToast() {
    if (typeof (this.toastInfoRef) == 'object') {
      this.toastr.clear(this.toastInfoRef.ToastId)
    }
  }
  /************************************************************************************* */
  showErrorWithTimeout(message:any, title:any) {
    this.toastErrorRef = this.toastr.error(message, title, {
      disableTimeOut: true,
      tapToDismiss: false,
    })
  }
  hideErrorToast() {
    if (typeof (this.toastErrorRef) == 'object') {
      this.toastr.clear(this.toastErrorRef.ToastId)
    }
  }
  //*********************************************************************************** */
  /************************************************************************************* */
  showWarningWithTimeout(message:any, title:any) {
    this.toastErrorRef = this.toastr.warning(message, title, {
      disableTimeOut: false,
      tapToDismiss: false
    })
  }
  hideWarningToast() {
    if (typeof (this.toastErrorRef) == 'object') {
      this.toastr.clear(this.toastErrorRef.ToastId)
    }
  }
  //*********************************************************************************** */
}


