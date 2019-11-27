import { Routes, RouterModule } from '@angular/router';
import { CompanyAuthGuard } from '../../../_guards/auth.guard';
import { NgModule } from '@angular/core';
import { MostDialledNumberDetailReportComponent } from './most-dialled-number-detail.component';

const routes: Routes = [
    { path: '', component: MostDialledNumberDetailReportComponent, canActivate: [CompanyAuthGuard], data: { title: 'Most Dialled Number Detail' } },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MostDialledNumberDetailReportRoutingModule {
}
