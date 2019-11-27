import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { BillingHistoricalUsageReportComponent } from './billing-historical-usage-report.component';

const routes: Routes = [
    { path: '', component: BillingHistoricalUsageReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Billing Historical Usage'} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingHistoricalUsageReportRoutingModule {
}
