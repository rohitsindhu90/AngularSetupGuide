import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { UpdateAssetDetailsComponent } from './updateasset-details.component';

const routes: Routes = [
    { path: '', component: UpdateAssetDetailsComponent, canActivate: [CompanyAuthGuard], data: { title: 'Update Asset Details', shouldDetach: false } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UpdateAssetDetailsRoutingModule {
}
