import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { UpdateMobileComponent } from './update-mobile.component';

const routes: Routes = [
    { path: '', component: UpdateMobileComponent, canActivate: [CompanyAuthGuard], data: { title: 'Update Mobile Detail', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UpdateMobileRoutingModule {
}
