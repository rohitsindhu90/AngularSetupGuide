import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button';
import { DtCommonModule } from '../modules/dt-common.module';
import { FleetRoutingModule } from './fleet.route';
import { FleetComponent } from './fleet.component';
import { FleetManageComponent } from './fleet.manage.component';
import { FleetLinkSourceComponent } from './fleet.linksource.component';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primengdevng8/tabview';
import { DropdownModule } from 'primengdevng8/dropdown';

@NgModule(
    {
        declarations: [
            FleetComponent,
            FleetManageComponent,
            FleetLinkSourceComponent
        ],
        imports: [
            CommonModule,
            FormsModule,
            DtCommonModule,
            FleetRoutingModule,
            ButtonModule,
            CheckboxModule,
            TabViewModule,
            DropdownModule
        ]
    }
)
export class FleetModule { }