import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { DataSummaryReportComponent } from './data-summary-report.component';


const routes: Routes = [
    { path: '', component: DataSummaryReportComponent, data: { title: 'Data Summary Report' }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataSummaryReportRoutingModule {
}
