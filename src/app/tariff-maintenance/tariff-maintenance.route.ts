import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TariffMaintenanceComponent } from './tariff-maintenance.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: TariffMaintenanceComponent, canActivate: [CompanyAuthGuard], data: { title: 'Tariff Maintenance', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TariffMaintenanceRoutingModule {
}
