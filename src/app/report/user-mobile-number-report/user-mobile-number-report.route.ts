import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { UserMobileNumberReportComponent } from './user-mobile-number-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: UserMobileNumberReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'User Mobile Number Report', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserMobileNumberReportRoutingModule {
}
