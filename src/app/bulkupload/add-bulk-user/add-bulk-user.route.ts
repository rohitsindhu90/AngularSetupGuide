import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddBulkUserComponent } from './add-bulk-user.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: AddBulkUserComponent, canActivate: [CompanyAuthGuard], data: { title: 'Add Bulk User', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddBulkUserRoutingModule {
}
