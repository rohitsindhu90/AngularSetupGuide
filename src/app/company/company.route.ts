import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './company.component';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';

const routes: Routes = [
    { path: '', component: CompanyComponent, canActivate: [CompanyAuthGuard], data: { title: 'Company', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CompanyRoutingModule {
}
