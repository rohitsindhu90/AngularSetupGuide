import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { ZeroUsageByMonthReportComponent } from './zero-usage-by-month-report.component';

const routes: Routes = [
    { path: '', component: ZeroUsageByMonthReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Zero Usage By Month Report'} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZeroUsageByMonthReportRoutingModule {
}
