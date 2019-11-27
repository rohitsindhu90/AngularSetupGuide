import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EditBulkCTNComponent } from './edit-bulk-ctn.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: EditBulkCTNComponent, canActivate: [CompanyAuthGuard], data: { title: 'Edit Bulk CTN', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditBulkCTNRoutingModule {
}
