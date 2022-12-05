import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMemberComponent } from './Add-Member/add-member/add-member.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './authentication/login/login.component';
import { DailyentryComponent } from './Daily/dailyentry/dailyentry.component';
// , canActivate: [AuthGuard]
const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'DailyEntry', component:DailyentryComponent},
  {path:'AddMember', component:AddMemberComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
