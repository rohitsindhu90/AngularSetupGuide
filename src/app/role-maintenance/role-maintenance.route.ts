import { Routes, RouterModule } from '@angular/router';
import { RoleMaintenanceComponent } from './role-maintenance.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: RoleMaintenanceComponent, canActivate: [CompanyAuthGuard], data: { title: 'Role Maintenance', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleMaintenanceRoutingModule {
}
