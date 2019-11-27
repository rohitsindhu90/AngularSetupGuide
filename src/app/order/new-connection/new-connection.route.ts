import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NewConnectionComponent } from './new-connection.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: NewConnectionComponent, canActivate: [CompanyAuthGuard], data: { title: 'New Connection', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NewConnectionRoutingModule {
}
