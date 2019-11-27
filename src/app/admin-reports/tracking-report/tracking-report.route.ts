import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { TrackingReportComponent } from './tracking-report.component';

const routes: Routes = [
    //{ path: '', component: CompanyComponent, canActivate: [CompanyAuthGuard], data: { title: 'Company', shouldDetach: false } },
    { path: '', component: TrackingReportComponent, data: { title: 'Login History Report', shouldDetach: false } },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TrackingReportRoutingModule {
}
