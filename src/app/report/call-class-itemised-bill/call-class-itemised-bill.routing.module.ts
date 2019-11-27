    import { NgModule } from '@angular/core';
    import { Routes, RouterModule } from '@angular/router';
    import { CompanyAuthGuard } from '../../_guards/auth.guard';
    import { CallClassItemisedBillComponent } from './call-class-itemised-bill.component';


    const routes: Routes = [
    {
        path: '',
        component: CallClassItemisedBillComponent,
        canActivate: [CompanyAuthGuard], 
        data: { title: 'Total Billing Itemised Bill', shouldDetach: false } ,
    
    }
    ];

    @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
    })
    export class CallClassItemisedBillRoutingModule { }