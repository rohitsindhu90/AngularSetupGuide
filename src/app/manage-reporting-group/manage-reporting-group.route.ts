import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ManagerReportingGroupComponent } from './manage-reporting-group.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: ManagerReportingGroupComponent, canActivate: [CompanyAuthGuard], data: { displayTitle: false, shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ManagerReportingGroupRoutingModule {
}
