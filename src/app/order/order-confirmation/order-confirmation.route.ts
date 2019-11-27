import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';
import { OrderConfirmationComponent } from './order-confirmation.component';

const routes: Routes = [
    { path: '', component: OrderConfirmationComponent, canActivate: [CompanyAuthGuard], data: { title: 'Order Confirmation', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderConfirmationRoutingModule {
}
