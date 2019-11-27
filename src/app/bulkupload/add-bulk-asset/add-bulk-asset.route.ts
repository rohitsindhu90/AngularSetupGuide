import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AddBulkAssetComponent } from './add-bulk-asset.component';
import { CompanyAuthGuard } from 'src/app/_guards/auth.guard';

const routes: Routes = [
    { path: '', component: AddBulkAssetComponent, canActivate: [CompanyAuthGuard], data: { title: 'Add Bulk Asset', shouldDetach: false } },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddBulkAssetRoutingModule {
}
