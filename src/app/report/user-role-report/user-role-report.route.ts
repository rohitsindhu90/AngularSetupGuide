import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { UserRoleReportComponent } from './user-role-report.component';


const routes: Routes = [
    { path: '', component: UserRoleReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'User Role Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoleReportRoutingModule {
}
