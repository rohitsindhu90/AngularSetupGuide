import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { OverUsageReportComponent } from '../over-usage-report/over-usage-report.component';


const routes: Routes = [
    { path: '', component: OverUsageReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Over Usage Report', shouldDetach: false} },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OverUsageReportRoutingModule {
}
