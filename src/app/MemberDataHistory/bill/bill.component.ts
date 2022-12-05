import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/Services/error-handling/error-handling.service';
import { HttpService } from 'src/app/Services/http/http.service';
import { NotifyService } from 'src/app/Services/Notification/notify.service';
import { UserService } from 'src/app/Services/users/user.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {
  displayedColumns: string[] = ['date', 'time', 'milk', 'snf', 'fat', 'rate', 't_rate'];
  dataSource: any;
  frm_bill: FormGroup;
  arr_tableData: any;
  bln_data: any;
  bln_isLast: any;
  TotalMilk: any;
  TotalT_Rate: any;
  int_cutting: any = 0;
  supBalance: any;
  Eve_TotalMilk: any;
  Mor_TotalMilk: any;
  Mor_TotalT_Rate: any;
  Eve_TotalT_Rate: any;
  bln_billExist: any;
  toolbar: any;
  str_path: any;
  pdfSrc: any;
  Url: any;
  get int_advance() {
    return this.frm_bill.get('int_advance');
  }
  get int_bank() {
    return this.frm_bill.get('int_bank');
  }
  get int_supply() {
    return this.frm_bill.get('int_supply');
  }
  get int_supBalance() {
    return this.frm_bill.get('int_supBalance');
  }
  get int_advBalance() {
    return this.frm_bill.get('int_advBalance');
  }
  constructor(private user: UserService,
    private http: HttpService,
    private sanitizer: DomSanitizer,
    private errorHandeling: ErrorHandlingService,
    private fb: FormBuilder,
    private notify: NotifyService) {
    this.frm_bill = this.fb.group({
      int_advance: ['0', Validators.compose([Validators.required])],
      int_bank: ['0', Validators.compose([Validators.required])],
      int_supply: ['0', Validators.compose([Validators.required])],
      int_supBalance: ['0', Validators.compose([Validators.required])],
      int_advBalance: ['0', Validators.compose([Validators.required])]
    })
  }

  ngOnInit(): void {
    this.getBillIfExist();
  }
  getData() {
    let data = {};
    this.bln_isLast = this.user.getBillDetails() == 'last'
    Object.assign(data, { UId: this.user.getUId() }, { No: this.user.getMemberNo() }, { BillDetails: this.user.getBillDetails() });
    this.arr_tableData = [];
    this.http.postMethod('DailyData/getDataForBill', data).subscribe((res: any) => {
      if (res.result == "No data") {
        this.bln_data = false;
      }
      else if (res.result == "Data") {
        this.bln_data = true;
        this.TotalMilk = res.totalMilk;
        this.TotalT_Rate = res.TotalT_rate;
        this.Mor_TotalT_Rate = res.mor_TotalT_rate;
        this.Mor_TotalMilk = res.mor_totalMilk;
        this.Eve_TotalMilk = res.eve_totalMilk;
        this.Eve_TotalT_Rate = res.eve_TotalT_rate;
        res.data.forEach((ele: any) => {
          this.arr_tableData.push(ele)
        });
        this.dataSource = this.arr_tableData;
      }
    }, (err: any) => {
      console.log(err);
      this.errorHandeling.checkError(err);
    });
  }

  onBillSave() {
    this.notify.showWarningWithTimeout("Saving Data", "");
    let data = {
      UId: this.user.getUId(),
      No: this.user.getMemberNo(),
      Name: this.user.getMemberName(),
      advance: (this.int_advance?.value) ? this.int_advance?.value : 0,
      bank: (this.int_bank?.value) ? this.int_bank?.value : 0,
      supply: (this.int_supply?.value) ? this.int_supply?.value : 0,
      balance: this.supBalance,
      totalCutting: this.int_cutting,
      amountTogiven: (this.TotalT_Rate - this.int_cutting).toFixed(2),
      totalMilk: this.TotalMilk,
      totalRate: this.TotalT_Rate,
      eve_totalMilk: this.Eve_TotalMilk,
      eve_totalRate: this.Eve_TotalT_Rate,
      mor_totalMilk: this.Mor_TotalMilk,
      mor_totalRate: this.Mor_TotalT_Rate,
    }
    this.http.postMethod('Bill/postBill', data).subscribe(
      (res: any) => {
        this.notify.hideWarningToast()
        if (res.result == 'Data Added Successfully') {
          this.notify.showSuccessWithTimeout("Data Saved Sucessfully", "");
        } else if (res.result == 'Data Already Exist') {
          this.notify.showWarningWithTimeout("Data Already Exist !!", "");
        } else {
          this.notify.hideWarningToast();
          this.notify.showErrorWithTimeout("Error Saving Data", "");
          setTimeout(() => {
            this.notify.hideErrorToast();
          }, 4000);
        }
      },
      (err: any) => {
        console.log(err);
        this.errorHandeling.checkError(err);
        setTimeout(() => {
          this.notify.hideErrorToast();
        }, 4000);
      })
  }

  calculateBill() {
    let int_advance = (this.int_advance?.value) ? this.int_advance?.value : 0;
    let int_bank = (this.int_bank?.value) ? this.int_bank?.value : 0;
    let int_supply = (this.int_supply?.value) ? this.int_supply?.value : 0;
    let cutting = (Number(int_advance) + Number(int_bank) + Number(int_supply));
    this.int_cutting = cutting.toFixed(2)
    if (Number(int_supply) == 0) {
      this.int_supBalance?.patchValue(this.supBalance)
    } else {
      this.int_supBalance?.patchValue(this.supBalance - Number(int_supply))
    }

  }
  getSupplyBalance() {
    let data = {}
    Object.assign(data, { UId: this.user.getUId() }, { No: this.user.getMemberNo() }, { type: "supply" })
    this.http.postMethod('Account/getTotalBalance', data).subscribe((res: any) => {
      this.int_supBalance?.patchValue((res.result) ? res.result : 0)
      this.supBalance = res.result
    }, (err: any) => {
      console.log(err);
      this.errorHandeling.checkError(err);
    })
  }

  getBillIfExist() {
    let data = {};
    this.bln_isLast = this.user.getBillDetails() == 'last'
    Object.assign(data, { UId: this.user.getUId() }, { No: this.user.getMemberNo() });
    this.http.postMethod('Bill/getExistBillData', data).subscribe((res: any) => {
      if (res.result != "Data Not Exist") {
        console.log(res.result);
        this.bln_billExist = true;
        this.toolbar = "#toolbar=0&navpanes=0";
        const rand = Math.random();
        this.str_path = res.result;
        this.pdfSrc = res.result + "?v=" + rand + this.toolbar;
        this.Url = this.sanitizer.bypassSecurityTrustResourceUrl(this.str_path);
      } else {
        this.getSupplyBalance()
        this.getData();
        this.bln_billExist = false;
      }
    },
      (err: any) => {
        console.log(err);
        this.errorHandeling.checkError(err);
      })
  }
}
