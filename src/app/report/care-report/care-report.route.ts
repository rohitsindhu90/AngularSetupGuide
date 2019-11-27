import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { CareReportComponent } from './care-report.component';

const routes: Routes = [
    { path: '', component: CareReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Care Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CareReportRoutingModule {
}
