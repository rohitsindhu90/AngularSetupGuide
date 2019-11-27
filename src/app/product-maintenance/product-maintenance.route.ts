import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ProductMaintenanceComponent } from './product-maintenance.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ProductMaintenanceComponent, canActivate: [CompanyAuthGuard], data: { title: 'Product Maintenance', shouldDetach: false } },  
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductMaintenanceRoutingModule {
}
