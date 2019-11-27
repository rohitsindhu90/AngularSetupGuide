import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { ClientUserAgreementComponent } from './client-agreement.component';

const routes: Routes = [
    { path: '', component: ClientUserAgreementComponent, data: { title: 'Client Agreement', shouldDetach: false }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientUserAgreementRoutingModule {
}
