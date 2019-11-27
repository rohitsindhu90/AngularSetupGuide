import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { OrderReportComponent } from './order-report.component';

const routes: Routes = [
    { path: '', component: OrderReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Order Report', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderReportRoutingModule {
}
