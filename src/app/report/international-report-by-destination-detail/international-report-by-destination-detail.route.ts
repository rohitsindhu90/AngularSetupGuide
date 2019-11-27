import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { InternationalReportByDestinatinDetailComponent } from './international-report-by-destination-detail.component';

const routes: Routes = [
    { path: '', component: InternationalReportByDestinatinDetailComponent, canActivate: [CompanyAuthGuard], data: { title: 'International Report By Destination Detail' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternationalReportByDestinatinDetailRoutingModule {
}
