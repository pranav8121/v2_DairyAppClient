import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { UserService } from '../Services/users/user.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  Name: any = sessionStorage.getItem("Name");
  navbaropen: any = false;

  constructor(private router: Router,
    private user: UserService) {
    this.user.navbaropen.subscribe((res: any) => {
      this.navbaropen = res;
    })
  }

  ngOnInit(): void {
  }
  logout() {
    swal.fire({
      title: `Confirm Logout`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085D6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel"
    }).then((result: any) => {
      if (result.isConfirmed) {
        console.log('logout()', result.isConfirmed);
        this.user.UserLogout();
      }
    },
      function (dismiss) { }
    );
  }

  navbarToggel() {
    this.user.navbaropen.next(!this.navbaropen)
  }
}
