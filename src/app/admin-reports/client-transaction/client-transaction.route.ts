import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { ClientTransactionComponent } from './client-transaction-report.component';

const routes: Routes = [
    { path: '', component: ClientTransactionComponent, canActivate: [CompanyAuthGuard], data: { title: 'Client Transactions', shouldDetach: false} },
   
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientTransactionRoutingModule {
}
