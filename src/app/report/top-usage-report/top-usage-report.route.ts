import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { TopUsageReportComponent } from './top-usage-report.component';

const routes: Routes = [
    { path: '', component: TopUsageReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Top Usage Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TopUsageReportRoutingModule {
}
