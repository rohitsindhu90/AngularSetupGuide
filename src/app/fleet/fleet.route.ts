import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { FleetComponent } from './fleet.component';

const routes: Routes = [
    { path: '', component: FleetComponent, canActivate: [CompanyAuthGuard], data: { title: 'Fleet Summary', shouldDetach: false} },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FleetRoutingModule {
}
