import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { SpendUsageReportComponent } from './spend-usage-report.component';

const routes: Routes = [
    { path: '', component: SpendUsageReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Spend And Usage Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpendUsageReportRoutingModule {
}
