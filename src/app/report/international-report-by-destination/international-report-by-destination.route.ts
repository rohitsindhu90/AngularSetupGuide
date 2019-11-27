import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { InternationalReportByDestinationComponent } from './international-report-by-destination.component';

const routes: Routes = [
    { path: '', component: InternationalReportByDestinationComponent, canActivate: [CompanyAuthGuard], data: { title: 'International Report By Destination' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InternationalReportByDestinationRoutingModule {
}
