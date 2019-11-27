import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [CompanyAuthGuard], data: { title: 'Dashboard', shouldDetach: true } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}
