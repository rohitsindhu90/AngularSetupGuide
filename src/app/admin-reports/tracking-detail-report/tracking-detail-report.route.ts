import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { TrackingDetailReportComponent } from './tracking-detail-report.component';

const routes: Routes = [
    { path: '', component: TrackingDetailReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Company Login Report' } },
    ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackingDetailReportRoutingModule {
}
