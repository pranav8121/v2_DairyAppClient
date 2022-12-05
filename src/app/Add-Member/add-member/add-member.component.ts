import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/Services/error-handling/error-handling.service';
import { HttpService } from 'src/app/Services/http/http.service';
import { NotifyService } from 'src/app/Services/Notification/notify.service';
import { UserService } from 'src/app/Services/users/user.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.css']
})
export class AddMemberComponent implements OnInit {
  UId: any = null;
  arr_memberNo: any;
  bln_noExist: any;
  bln_loading: any;
  frm_addMember: any = new FormGroup({
    'Name': new FormControl(null, [Validators.required]),
    'engName': new FormControl(null, [Validators.required]),
    'No': new FormControl(null, [Validators.required]),
    'Phone': new FormControl(null),
    'type': new FormControl('buffalow', [Validators.required]),
  });


  constructor(private notify: NotifyService,
    private http: HttpService,
    private user: UserService,
    private errorHandling: ErrorHandlingService) { }

  ngOnInit(): void {
    this.getMemberData();
  }

  getMemberData() {
    this.UId = this.user.getUId();
    let data = { UId: this.UId };
    this.arr_memberNo = [];
    this.http.postMethod('Member/getAllMember', data).subscribe((res: any) => {
      if (res.result) {
        res.result.forEach((ele: any) => {
          this.arr_memberNo.push(ele.No);
        });
      }
    }, (err: any) => {
      this.errorHandling.checkError(err);
    })
  }

  checkNumberExist(eve: any) {
    let inp = parseInt(eve.target.value);
    this.bln_noExist = false;
    if (this.arr_memberNo.includes(inp)) {
      this.bln_noExist = true;
    } else {
      this.bln_noExist = false;
    }
  }

  onSubmit() {
    this.bln_loading=true;
    this.notify.showInfoWithTimeout("Adding Member...", "")
    const data = {
      Name: this.frm_addMember.get('Name').value,
      engName: this.frm_addMember.get('engName').value,
      No: this.frm_addMember.get('No').value,
      type: this.frm_addMember.get('type').value,
      Phone: this.frm_addMember.get('Phone').value,
      UId: this.UId,
    };
    this.http.postMethod('Member/AddMember', data).subscribe((res: any) => {
      this.notify.hideInfoToast();
      this.notify.showSuccessWithTimeout("Member Added SuccessFully", "");
      this.getMemberData();
      this.resetForm();
      this.bln_loading=false;
    }, (err: any) => {
      this.notify.hideInfoToast()
      // this.errorHandling.checkError(err)
      this.notify.showErrorWithTimeout("Something Went Wrong","");
      setTimeout(() => {
        this.notify.hideErrorToast();
      }, 4000);
      this.bln_loading=false;
    });
  }

  resetForm() {
    this.frm_addMember.reset();
    this.frm_addMember.patchValue({
      type: 'buffalow'
    });
    this.bln_noExist = false;
  }
}
