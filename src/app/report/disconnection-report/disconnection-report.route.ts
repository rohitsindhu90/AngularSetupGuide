import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { DisconnectionReportComponent } from './disconnection-report.component';


const routes: Routes = [
    { path: '', component: DisconnectionReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Disconnection Report', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisconnectionReportRoutingModule {
}
