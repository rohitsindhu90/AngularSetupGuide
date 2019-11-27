import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChargeReportComponent } from './charge-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ChargeReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Charge Summary Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargeReportRoutingModule {
}
