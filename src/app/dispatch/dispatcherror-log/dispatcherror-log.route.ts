import { Routes, RouterModule } from '@angular/router';
import { DispatchErrorLogComponent } from '../dispatcherror-log/dispatcherror-log.component';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: DispatchErrorLogComponent, data: { title: 'Dispatch Log Report', shouldDetach: false }, canActivate: [CompanyAuthGuard] },    
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DispatchErrorLogRoutingModule {
}
