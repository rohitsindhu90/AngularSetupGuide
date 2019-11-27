import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EuroWorldTravellerReportComponent } from './euro-world-traveller-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: EuroWorldTravellerReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Euro & World Report' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EuroWorldTravellerReportRoutingModule {
}
