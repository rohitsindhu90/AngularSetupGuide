import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { CallClassComponent } from './call-class.component';

const routes: Routes = [
    { path: '', component: CallClassComponent, canActivate: [CompanyAuthGuard], data: { title: 'Total Billing Information' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CallClassRoutingModule {
}
