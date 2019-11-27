import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { ClientComponent } from './client.component';

const routes: Routes = [
    { path: '', component: ClientComponent, canActivate: [CompanyAuthGuard], data: { title: 'Client Configuration', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ClientRoutingModule {
}
