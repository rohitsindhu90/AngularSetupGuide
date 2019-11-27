import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { SavedReportComponent } from './saved-report.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: SavedReportComponent, data: { title: 'Saved Report', shouldDetach: false }, canActivate: [CompanyAuthGuard] },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SavedReportRoutingModule {
}
