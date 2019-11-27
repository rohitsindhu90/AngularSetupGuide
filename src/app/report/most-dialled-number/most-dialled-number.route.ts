import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { MostDialledNumberReportComponent } from './most-dialled-number.component';

const routes: Routes = [
    { path: '', component: MostDialledNumberReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Most Dialled Number' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MostDialledNumberReportRoutingModule {
}
