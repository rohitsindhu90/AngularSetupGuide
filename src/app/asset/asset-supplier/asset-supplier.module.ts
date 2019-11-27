import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primengdevng8/button'
import { AssetSupplierComponent } from './asset-supplier.component';
import { AssetSupplierRoutingModule } from './asset-supplier.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { RequiredAsteriskModule } from 'src/app/modules/requiredasterisk.module';

@NgModule(
  {
    declarations: [
      AssetSupplierComponent
    ],
    imports: [
      CommonModule,
      AssetSupplierRoutingModule,
      ButtonModule,
      FormsModule,
      DropdownModule,
      CheckboxModule,
      DtCommonModule,
      RequiredAsteriskModule
    ]
  }
)
export class AssetSupplierModule { }
