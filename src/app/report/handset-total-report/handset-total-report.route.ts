import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HandsetTotalReportComponent } from './handset-total-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: HandsetTotalReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Handset Total Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HandsetTotalReportRoutingModule {
}
