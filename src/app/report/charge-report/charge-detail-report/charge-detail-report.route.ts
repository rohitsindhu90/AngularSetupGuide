import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ChargeDetailReportComponent } from './charge-detail-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ChargeDetailReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Charge Summary Detail' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ChargeDetailReportRoutingModule {
}
