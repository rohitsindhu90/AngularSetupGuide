import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { RoamedReportByCountryComponent } from './roamed-report-by-country.component';

const routes: Routes = [
    { path: '', component: RoamedReportByCountryComponent, canActivate: [CompanyAuthGuard], data: { title: 'Roamed Report By Country' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoamedReportByCountryRoutingModule {
}
