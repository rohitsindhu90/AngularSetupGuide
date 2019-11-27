import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { AssetSupplierComponent } from './asset-supplier.component';

const routes: Routes = [
    { path: '', component: AssetSupplierComponent, canActivate: [CompanyAuthGuard], data: { title: 'Manage Supplier', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssetSupplierRoutingModule {
}
