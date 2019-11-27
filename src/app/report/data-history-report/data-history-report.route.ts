import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';
import { DataHistoryReportComponent } from './data-history-report.component';

const routes: Routes = [
  { path: '', component: DataHistoryReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Data History Report' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataHistoryReportRoutingModule { }
