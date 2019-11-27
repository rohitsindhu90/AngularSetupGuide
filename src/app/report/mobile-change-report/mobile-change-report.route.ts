import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { MobileChangeReportComponent } from './mobile-change-report.component';

const routes: Routes = [
    { path: '', component: MobileChangeReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Mobile Change Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MobileChangeReportRoutingModule {
}
