import { Routes, RouterModule } from '@angular/router';;
import { NgModule } from '@angular/core';

import { InvoiceItemisedBillComponent } from './invoice.itemisedbill.component';
import { CompanyAuthGuard } from '../../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: InvoiceItemisedBillComponent, canActivate: [CompanyAuthGuard], data: { title: 'Itemised Bill' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InvoiceItemisedBillRoutingModule {
}
