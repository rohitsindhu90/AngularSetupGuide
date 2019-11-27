import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { RefurbishedProductComponent } from './refurbished-product.component';


const routes: Routes = [
    { path: '', component: RefurbishedProductComponent, data: { title: 'Refurbished Product', shouldDetach: false}, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RefurbishedProductRoutingModule {
}
