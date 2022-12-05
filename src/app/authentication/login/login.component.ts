import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorHandlingService } from 'src/app/Services/error-handling/error-handling.service';
import { HttpService } from 'src/app/Services/http/http.service';
import { UserService } from 'src/app/Services/users/user.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  err: any
  temp: any
  isClicked: any = false
  str_message:any
  str_warningState: any;

  LoginForm: any = new FormGroup({
    'Username': new FormControl(null, [Validators.required]),
    'Password': new FormControl(null, [Validators.required]),
  });
  
  constructor(private http: HttpService, private error: ErrorHandlingService, private user: UserService) { }

  ngOnInit(): void {
  }
  submit() {
    this.isClicked = true
    const data = {
      username: this.LoginForm.get('Username').value,
      password: this.LoginForm.get('Password').value
    }
    // DailyEntry
    this.http.postMethod('Login/AuthDairy', data).subscribe((res: any) => {
      this.isClicked = false
      if (res.result == 'Login SuccessFull') {
        console.log(res.details);
        
        this.user.Userlogin(res.details,res.token)
      }
      else if (res.result == 'Username does not exist') {
        console.log('Username does not exist');
        this.str_warningState = "danger";
        this.str_message = "Username does not exist";
      }
      else if (res.result == "Invalid Username or password") {
        this.str_warningState = "danger";
        this.str_message = "Invalid Username or password";
      }
      else if (res.result == "User Already Active") {
        this.str_warningState = "danger";
        this.str_message = "User Already Active";
      }
      else{
        swal.fire({
          title: 'Operation failed',
          text: '',
          icon: 'error',
        })
      }
      console.log(res);
    }, (err: any) => {
      this.isClicked = false
      this.error.checkError(err)
      console.log(err);
    })
  }
}
