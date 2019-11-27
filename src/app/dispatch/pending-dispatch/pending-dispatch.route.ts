import { Routes, RouterModule } from '@angular/router';
import { PendingDispatchComponent } from './pending-dispatch.component';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [ 
    { path: '', component: PendingDispatchComponent, data: { title: 'Pending Dispatch Orders', shouldDetach: false }, canActivate: [CompanyAuthGuard] },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PendingDispatchRoutingModule {
}
