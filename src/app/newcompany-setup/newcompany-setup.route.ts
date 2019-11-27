import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { NewCompanySetupComponent } from './newcompany-setup.component';

const routes: Routes = [
    { path: '', component: NewCompanySetupComponent, data: { title: 'New Company Setup', shouldDetach: false}, canActivate: [CompanyAuthGuard] },
    //{ path: 'newcompany-setup', component: NewCompanySetupComponent, data: { title: 'New Company Setup', shouldDetach: false}, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewcompanySetUpRoutingModule {
}
