import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { EmailConfigComponent } from './emailconfig.component';

const routes: Routes = [ 
    { path: '', component: EmailConfigComponent, canActivate: [CompanyAuthGuard], data: { title: 'Email Configuration', shouldDetach: false } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmailConfigRoutingModule {
}
