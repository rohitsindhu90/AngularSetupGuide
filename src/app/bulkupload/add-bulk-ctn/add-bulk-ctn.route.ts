import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddBulkCtnComponent } from './add-bulk-ctn.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: AddBulkCtnComponent, canActivate: [CompanyAuthGuard], data: { title: 'Add Bulk CTN', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddBulkCtnRoutingModule {
}
