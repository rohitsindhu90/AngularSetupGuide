import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NonGeoraphyItemisedComponent } from './non-geographic-itemised.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: NonGeoraphyItemisedComponent, canActivate: [CompanyAuthGuard], data: { title: 'Non-Geographic Itemised' } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NonGeoraphyItemisedRoutingModule {
}
