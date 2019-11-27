import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ZeroUsageReportComponent } from './zero-usage-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ZeroUsageReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Zero Usage Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ZeroUsageReportRoutingModule {
}
