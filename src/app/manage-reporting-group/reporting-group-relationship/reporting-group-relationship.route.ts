import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';
import { ReportingGroupRelComponent } from './reporting-group-relationship.component';

const routes: Routes = [
    { path: '', component: ReportingGroupRelComponent, canActivate: [CompanyAuthGuard], data: { title: 'Maintain Reporting Group Relationships', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReportingGroupRelRoutingModule {
}
