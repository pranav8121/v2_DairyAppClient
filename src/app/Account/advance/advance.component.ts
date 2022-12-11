import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/Services/error-handling/error-handling.service';
import { HttpService } from 'src/app/Services/http/http.service';
import { NotifyService } from 'src/app/Services/Notification/notify.service';
import { UserService } from 'src/app/Services/users/user.service';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.css']
})
export class AdvanceComponent implements OnInit {
  No: any;
  p: any = 1;
  Name: any;
  UId: any;
  bln_dataExist: any
  frm_Advance: any = new FormGroup({
    'Amount': new FormControl(null, [Validators.required]),
  });
  arr_advData: any = [];
  balance: any;
  constructor(private notify: NotifyService,
    private http: HttpService,
    private user: UserService,
    private errorHandling: ErrorHandlingService,
    private spinner: NgxSpinnerService) {
    this.No = this.user.getMemberNo();
    this.Name = this.user.getMemberName();
    this.UId = this.user.getUId();
  }

  ngOnInit(): void {
    this.spinner.show();
    this.getData();
  }
  onSave(act: any) {
    let data: any
    let action: any

    if (act == 1) {
      action = "Adding"
      data = {
        addAmount: this.frm_Advance.get('Amount').value,
        type: 'advance',
        No: this.No,
        Name: this.Name,
        UId: this.UId
      };
    }
    if (act == 0) {
      action = "Cutting"
      data = {
        cutAmount: this.frm_Advance.get('Amount').value,
        type: 'advance',
        No: this.No,
        Name: this.Name,
        UId: this.UId
      };
    }

    swal.fire({
      title: `Confirm ${action} ${this.frm_Advance.get('Amount').value}`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.http.postMethod('Account/postAdvance', data).subscribe((res: any) => {
          if (res.result == 'Data Added Successfully') {
            swal.fire({
              title: `Data Added Successfully`,
              text: '',
              icon: 'success'
            });
            this.getData();
            this.frm_Advance.reset();
          } else {
            swal.fire({
              title: `Operation Fail`,
              text: '',
              icon: 'warning'
            });
            this.spinner.hide();
          }
        }, (err: any) => {
          this.spinner.hide();
          console.log(err);
          this.errorHandling.checkError(err);
        });
      }
    },
      function (dismiss) { });
  };

  getData() {
    let data = {
      type: 'advance',
      No: this.No,
      UId: this.UId
    };
    this.spinner.show();
    this.http.postMethod('Account/getAccount', data).subscribe((res: any) => {
      // console.log(res.result);
      if (res.result != "No data found") {
        this.balance = res.balance
        this.arr_advData = [];
        this.bln_dataExist = true;
        let tableData = (res.result).reverse()
        tableData.forEach((ele: any) => {
          this.arr_advData.push(ele);
          this.spinner.hide();
        });
      } else {
        this.bln_dataExist = false
        this.spinner.hide();
      }
    }, err => {
      console.log(err);
      this.spinner.hide();
      this.errorHandling.checkError(err)
    })
  }
}
