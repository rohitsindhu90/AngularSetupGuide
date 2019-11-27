import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { NonGeographicReportComponent } from './non-geographic.component';

const routes: Routes = [
    { path: '', component: NonGeographicReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Non-Geographic Report' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NonGeographicReportRoutingModule {
}
