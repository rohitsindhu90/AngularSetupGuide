import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { RoamedReportItemisedComponent } from './roamed-report-itemised.component';

const routes: Routes = [
    { path: '', component: RoamedReportItemisedComponent, canActivate: [CompanyAuthGuard], data: { title: 'Roamed By Country Detail Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoamedReportItemisedRoutingModule {
}
