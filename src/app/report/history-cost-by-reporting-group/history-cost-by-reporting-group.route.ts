import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { HistoryCostByReportingGroupComponent } from './history-cost-by-reporting-group.component';

const routes: Routes = [
    { path: '', component: HistoryCostByReportingGroupComponent, canActivate: [CompanyAuthGuard], data: { title: 'Historic Costs By Reporting Group' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HistoryCostByReportingGroupRoutingModule {
}
