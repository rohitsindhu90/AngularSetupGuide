import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CareComponent } from './care.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';

const routes: Routes = [
    { path: '', component: CareComponent, canActivate: [CompanyAuthGuard], data: { title: 'Care', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CareRoutingModule {
}
