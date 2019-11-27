import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { AssetChangeReportComponent } from './asset-change-report.component';

const routes: Routes = [
    { path: '', component: AssetChangeReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Asset Change Report', shouldDetach: false } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetChangeReportRoutingModule {
}
