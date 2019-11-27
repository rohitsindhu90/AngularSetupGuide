import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { BillingAverageTrendComponent } from './billing-average-trend.component';

const routes: Routes = [
    { path: '', component: BillingAverageTrendComponent, data: { title: 'Billing Average Trend' }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BillingAverageTrendRoutingModule {
}
