import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManageAddressComponent } from './manage-address.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ManageAddressComponent, canActivate: [CompanyAuthGuard], data: { title: 'Address Maintenance', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManageAddressRoutingModule {
}
