import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HardwareOrdersComponent } from './hardware.orders.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: HardwareOrdersComponent, canActivate: [CompanyAuthGuard], data: { title: 'Hardware Order', shouldDetach: false } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HardwareOrdersRoutingModule {
}
