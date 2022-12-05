import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  check: any;
  constructor(public router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    {
      if (sessionStorage.getItem('isUserLoggedIn')) {
        return true;
      } else {
        swal.fire({
          title: 'Login to Continue',
          text: '',
          icon: 'success',
        });
        this.router.navigate([''])

        return false;
      }
    }
  }

}
