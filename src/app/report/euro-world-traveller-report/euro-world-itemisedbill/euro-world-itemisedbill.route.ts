import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';
import { EuroWorldItemisedBillComponent } from './euro-world-itemisedbill.component';

const routes: Routes = [
    { path: '', component: EuroWorldItemisedBillComponent, canActivate: [CompanyAuthGuard], data: { title: 'Euro & World Itemised Bill' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EuroWorldItemisedBillRoutingModule {
}
