import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ChartService } from 'src/app/Services/Chart/chart.service';
import { ErrorHandlingService } from 'src/app/Services/error-handling/error-handling.service';
import { HttpService } from 'src/app/Services/http/http.service';
import { NotifyService } from 'src/app/Services/Notification/notify.service';
import { UserService } from 'src/app/Services/users/user.service';
import swal from 'sweetalert2';
@Component({
  selector: 'app-dailyentry',
  templateUrl: './dailyentry.component.html',
  styleUrls: ['./dailyentry.component.css']
})
export class DailyentryComponent implements OnInit {
  currentDate: any = new Date();;
  timeMsg: any = "";
  totalBuff: any = 99;
  totalCow: any = 99;
  dmem: any = 99;
  tmember: any = 99;
  Cnum: any;
  Name: any = "staticName";
  bln_details: any = false;
  RateVal: any = 0;
  TotalVal: any = 0;
  t_rateBuff: any = 99;
  t_rateCow: any = 99;
  totalMilk: any = 99;
  totalRate: any = 99;
  btnData: any = [
    { name: "चालू", id: "cur", flag: false },
    { name: "मागील", id: "las", flag: false },
    { name: "ऍडव्हान्स", id: "adv", flag: false },
    { name: "पशुखाद्य", id: "sup", flag: false }
  ];
  las: any;
  adv: any;
  sup: any;
  cur: any;
  UId: any;
  arr_memberData: any;
  arr_todaysData: any;
  bln_isCow: any;
  bln_ifUserExist: any;
  cowFatRate: any;
  bufFatRate: any;
  cowSnfRate: any;
  bufSnfRate: any;
  tbl_cow: any;
  tbl_buf: any;
  bln_isInvalid: any = true;
  str_isInvalid: any;
  bln_dailyEntryExist: any;
  ExistMilk: any;
  ExistSnf: any;
  ExistFat: any;
  ExistRate: any;
  ExistTotalRate: any;
  dairyName: any;


  frm_entryForm: any = new FormGroup({
    'milk': new FormControl(null, [Validators.required]),
    'snf': new FormControl(null, [Validators.required]),
    'fat': new FormControl(null, [Validators.required]),
  });
  constructor(private notify: NotifyService,
    private http: HttpService,
    private user: UserService,
    private errorHandling: ErrorHandlingService,
    private chart: ChartService) {

  }

  ngOnInit(): void {
    this.getData();
    setInterval(() => { this.getTimeMsg() }, 60000);
    this.Showdetails();
  }

  getData() {
    this.UId = this.user.getUId();
    this.dairyName = this.user.getDairyName();
    this.getTimeMsg();
    const data = {
      UId: this.UId,
      hour: this.timeMsg
    }
    this.arr_memberData = [];
    this.arr_todaysData = [];
    forkJoin({
      memberData: this.http.postMethod('Member/getAllMember', data),
      todaysData: this.http.postMethod('DailyData/getTodayData', data)
    }).subscribe((res: any) => {
      let memberData = res.memberData.result;
      let todaysData = res.todaysData.result;
      if (todaysData.length > 0 && todaysData !== "NA") {
        todaysData.forEach((ele: any) => {
          this.arr_todaysData.push(ele);
        });
      };
      if (memberData.length > 0 && memberData !== "NA") {
        memberData.forEach((ele: any) => {
          this.arr_memberData.push(ele);
        });
        this.showMember(this.arr_memberData[0].No);
        this.Cnum = this.arr_memberData[0].No;
      };
      this.tmember = this.arr_memberData.length;
      this.dmem = this.arr_todaysData.length;
      this.doneMemberCalulation();
      this.getChartData();
    }, (err: any) => {
      console.log(err);
      this.errorHandling.checkError(err);
    });
  };

  getChartData() {
    this.cowFatRate = this.chart.Cow_fatRate
    this.bufFatRate = this.chart.Buff_fatRate
    this.cowSnfRate = this.chart.Cow_snfRate
    this.bufSnfRate = this.chart.Buff_snfRate
    this.tbl_cow = this.chart.Cow_matrix
    this.tbl_buf = this.chart.Buff_matrix
  };

  showMember(No: any) {
    this.Hidedetails()
    if (No > 0) {
      this.onReset()
      const data = this.arr_memberData.filter((x: any) => {
        return x.No == parseInt(No);
      });
      if (data.length > 0) {
        this.Cnum = data[0].No
        this.bln_ifUserExist = true
        this.Name = data[0].Name;
        this.bln_isCow = (data[0].type == "cow") ? true : false;
        const dataExist = this.arr_todaysData.filter((k: any) => {
          if (k.No == No) {
            return k
          }
        });
        this.bln_dailyEntryExist = false
        if (dataExist.length > 0) {
          this.bln_dailyEntryExist = true
          this.ExistMilk = dataExist[0].milk
          this.ExistSnf = dataExist[0].snf
          this.ExistFat = dataExist[0].fat
          this.ExistRate = dataExist[0].rate
          this.ExistTotalRate = dataExist[0].t_rate
        };
      } else {
        this.bln_ifUserExist = false
      };
    };
  };

  calculateRate() {
    this.bln_isInvalid = true;
    let rate: any;
    let t_rate: any;
    let milk = parseFloat(this.frm_entryForm.get('milk').value);
    let snf = parseFloat(this.frm_entryForm.get('snf').value);
    let fat = parseFloat(this.frm_entryForm.get('fat').value);
    if (milk && snf && fat) {
      if (!this.bln_isCow) {
        let i = this.bufFatRate.indexOf(fat);
        let j = this.bufSnfRate.indexOf(snf);
        if (i == -1 || j == -1) {
          this.bln_isInvalid = true;
          this.str_isInvalid = '*वैध क्रमांक भरा'
        } else {
          this.bln_isInvalid = false;
          this.str_isInvalid = ''
          rate = this.tbl_buf[i][j] + 2 + 2;
          t_rate = rate * milk;
          this.RateVal = rate.toFixed(2);
          this.TotalVal = t_rate.toFixed(2);
        }
      } else {
        let i = this.cowFatRate.indexOf(fat);
        let j = this.cowSnfRate.indexOf(snf);
        if (i == -1 || j == -1) {
          this.bln_isInvalid = true;
          this.str_isInvalid = '*वैध क्रमांक भरा'
        } else {
          this.bln_isInvalid = false;
          this.str_isInvalid = ''
          rate = this.tbl_cow[i][j] + 2;
          t_rate = rate * milk;
          this.RateVal = rate.toFixed(2);
          this.TotalVal = t_rate.toFixed(2);
        }
      }
    }
  };

  Showdetails() {
    this.bln_details = true;
    this.onBtn("las")
  };

  Hidedetails() {
    this.bln_details = false;
  };
  
  onBtn(id: any) {
    this.las = false;
    this.adv = false;
    this.sup = false;
    this.cur = false;
    this.user.setMemberNo(this.Cnum);
    this.user.setMemberName(this.Name);
    if (id == "cur") {
      this.cur = true;
      this.user.setBillDetails("current");
    }
    else if (id == "las") {
      this.las = true;
      this.user.setBillDetails("last");
    }
    else if (id == "adv") {
      this.adv = true;
    }
    else if (id == "sup") {
      this.sup = true;
    }
  };

  onSave() {
    this.notify.showWarningWithTimeout("Saving Data", "");
    let dataToSave = {
      Name: this.Name,
      No: this.Cnum,
      milk: parseFloat(this.frm_entryForm.get('milk').value),
      fat: parseFloat(this.frm_entryForm.get('fat').value),
      snf: parseFloat(this.frm_entryForm.get('snf').value),
      rate: this.RateVal,
      t_rate: this.TotalVal,
      hour: this.timeMsg,
      type: (this.bln_isCow) ? "cow" : "buffalow",
      UId: this.UId
    };
    this.http.postMethod('DailyData/postData', dataToSave).subscribe((res: any) => {
      this.notify.hideWarningToast()
      if (res.result == 'Data Added Successfully') {
        this.arr_todaysData.push(dataToSave);
        this.showMember(this.Cnum);
        this.notify.showSuccessWithTimeout("Data Saved Sucessfully", "");
        this.doneMemberCalulation()
        this.onReset();
      } else {
        this.notify.showWarningWithTimeout("Data Already Exist !!", "");
      };
    }, (err: any) => {
      console.log(err);
      this.notify.hideWarningToast();
      this.notify.showErrorWithTimeout("Error Saving Data", "");
      setTimeout(() => {
        this.notify.hideErrorToast();
      }, 4000);
    });
  };

  onReset() {
    this.RateVal = 0
    this.TotalVal = 0
    this.frm_entryForm.reset();
    this.bln_isInvalid = false;
  };

  logout() {
    swal.fire({
      title: 'Confirm Logout!',
      text: 'Do you want to continue',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('logout()',result.isConfirmed);
        this.user.UserLogout();
      }
    },
      function (dismiss) { }
    );
  };

  print() {
    var a: any = window.open('', '', 'height=500, width=500');
    a.document.write('<html>');
    a.document.write('<body >');
    a.document.write(`<h4 style="text-align:center;">${this.dairyName}</h4>`);
    a.document.write(`<p style="text-align:center;">नाव:${this.Cnum}-${this.Name}</p>`);
    a.document.write(`<p style="text-align:center;">ता./वेळ:${this.currentDate}/${this.timeMsg}</p>`);
    a.document.write(`<p style="text-align:center;">दुधाचा प्रकार:${(this.bln_isCow) ? "गाय" : "म्हैस"}</p>`);
    a.document.write('<hr/>')
    a.document.write(`<p> &nbsp दूध : &nbsp  ${this.ExistMilk} लिटर</p>`)
    a.document.write(`<p> &nbsp फॅट: &nbsp ${this.ExistFat}</p>`)
    a.document.write(`<p> &nbsp एस एन एफ: &nbsp ${this.ExistSnf}</p>`)
    a.document.write(`<p> &nbsp दर/लिटर : &nbsp ${this.ExistRate} रुपये </p>`)
    a.document.write(`<p> &nbsp एकूण दर  : &nbsp ${this.ExistTotalRate} रुपये</p>`)
    a.document.write('<hr/>')
    a.document.write('</body></html>');
    a.print();
    a.document.close();
  };

  doneMemberCalulation() {
    let tBuffM: number = 0; let tBuffR: number = 0; let tCowM: number = 0; let tCowR: number = 0;
    this.totalBuff = 0; this.t_rateBuff = 0; this.totalCow = 0; this.t_rateCow = 0;
    this.totalRate = 0; this.totalMilk = 0;
    this.arr_todaysData.forEach((ele: any) => {
      if (ele.type == "cow") {
        tCowM = tCowM + ele.milk;
        tCowR = tCowR + parseFloat(ele.t_rate);
      } else {
        tBuffM = tBuffM + ele.milk;
        tBuffR = tBuffR + parseFloat(ele.t_rate);
      }
    });
    this.totalBuff = tBuffM.toFixed(2);
    this.totalCow = tCowM.toFixed(2);
    this.t_rateBuff = tBuffR.toFixed(2);
    this.t_rateCow = tCowR.toFixed(2);
    this.totalMilk = parseFloat(this.totalCow) + parseFloat(this.totalBuff);
    this.totalRate = parseFloat(this.t_rateCow) + parseFloat(this.t_rateBuff);
  };

  getTimeMsg() {
    let today = new Date()
    let currentHour = today.getHours();
    if (currentHour >= 1 && currentHour < 15) {
      this.timeMsg = "morning";
    } else {
      this.timeMsg = "evening";
    }
  }
}
