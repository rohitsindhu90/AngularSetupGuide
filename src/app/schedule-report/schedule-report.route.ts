import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ScheduleReportComponent } from './schedule-report.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ScheduleReportComponent, data: { title: 'Schedule Report', shouldDetach: false}, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ScheduleReportRoutingModule {
}
