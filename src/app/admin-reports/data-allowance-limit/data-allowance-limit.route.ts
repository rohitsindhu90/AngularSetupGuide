import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { DataAllowanceLimitComponent } from './data-allowance-limit.component';

const routes: Routes = [
    { path: '', component: DataAllowanceLimitComponent, canActivate: [CompanyAuthGuard], data: { title: 'Data Allowance Limit', shouldDetach: false } },
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DataAllowanceLimitRoutingModule {
}
