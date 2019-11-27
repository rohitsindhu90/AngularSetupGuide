import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { AssetSummaryComponent } from './asset.summary.component';

const routes: Routes = [
    { path: '', component: AssetSummaryComponent, canActivate: [CompanyAuthGuard], data: { title: 'Asset Summary', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetSummaryRoutingModule {
}
