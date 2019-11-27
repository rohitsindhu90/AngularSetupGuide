import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { UploadInvoiceComponent } from './upload-invoice-component';

const routes: Routes = [    
    { path: '', component: UploadInvoiceComponent, canActivate: [CompanyAuthGuard], data: { title: 'Upload Invoice', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UploadInvoiceRoutingModule {
}
