import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { InvoiceComponent } from './invoice.component';

const routes: Routes = [
    { path: '', component: InvoiceComponent, canActivate: [CompanyAuthGuard], data: { title: 'Invoice' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
