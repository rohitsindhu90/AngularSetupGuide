import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { UserReportComponent } from './user-report.component';

const routes: Routes = [
    { path: '', component: UserReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'User Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserReportRoutingModule {
}
