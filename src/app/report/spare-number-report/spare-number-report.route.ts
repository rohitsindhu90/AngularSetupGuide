import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { SpareNumberReportComponent } from './spare-number-report.component';


const routes: Routes = [
    { path: '', component: SpareNumberReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Spare Number Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpareNumberReportRoutingModule {
}
