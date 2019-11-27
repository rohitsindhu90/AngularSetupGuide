import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddRefurbishedProductComponent } from './add-refurbished-product.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: AddRefurbishedProductComponent, data: { title: 'Add Refurbished Product', shouldDetach: false }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddRefurbishedProductRoutingModule {
}
