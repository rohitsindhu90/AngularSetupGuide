import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { BillingUsageTrendComponent } from './billing-usage-trend.component';

const routes: Routes = [
    { path: '', component: BillingUsageTrendComponent, data: { title: 'Billing Usage Trend' }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingUsageTrendRoutingModule {
}
