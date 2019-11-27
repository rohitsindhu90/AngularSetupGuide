import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { NonGeographicDetailReportComponent } from './non-geographic-detail.component';

const routes: Routes = [
    { path: '', component: NonGeographicDetailReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Non-Geographic Detail' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NonGeographicDetailReportRoutingModule {
}
