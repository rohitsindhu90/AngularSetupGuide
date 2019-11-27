import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { InternationalReportComponent } from './international-report.component';

const routes: Routes = [
    { path: '', component: InternationalReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'International Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternationalReportRoutingModule {
}
