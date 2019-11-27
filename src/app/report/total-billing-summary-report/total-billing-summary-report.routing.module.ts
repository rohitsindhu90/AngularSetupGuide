import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { TotalBillingSummaryReportComponent } from './total-billing-summary-report.component';

const routes: Routes = [
  {
    path: '',
    component: TotalBillingSummaryReportComponent,
    canActivate: [CompanyAuthGuard], 
    data: { title: 'Total Billing Summary' } ,
  
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TotalBillingSummaryReportRoutingModule { }