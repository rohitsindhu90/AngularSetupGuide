import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button'
import { DtCommonModule } from '../modules/dt-common.module';
import { AssetSummaryComponent } from './asset.summary.component';
import { AssetSummaryRoutingModule } from './asset.summary.route';
import { AssetFleetComponent } from './asset.fleet.component';
import { AssetLinkSourceComponent } from './asset.linksource.component';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { TabViewModule } from 'primengdevng8/tabview';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';

@NgModule(
    {
        declarations: [
            AssetSummaryComponent,
            AssetFleetComponent,
            AssetLinkSourceComponent
        ],
        imports: [
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            AssetSummaryRoutingModule,
            ButtonModule,
            CheckboxModule,
            TabViewModule,
            FormsModule,
            DropdownModule
        ]
    }
)
export class AssetSummaryModule { }