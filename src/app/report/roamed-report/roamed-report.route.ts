import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { RoamedReportComponent } from './roamed-report.component';

const routes: Routes = [
    { path: '', component: RoamedReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Roamed Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoamedReportRoutingModule {
}
