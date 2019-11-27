import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { DtCommonModule } from '../../modules/dt-common.module';
import { AssetChangeReportComponent } from './asset-change-report.component';
import { AssetChangeReportRoutingModule } from './asset-change-report.route';
import { CalendarModule } from 'primengdevng8/calendar';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';

@NgModule(
    {
        declarations:[
            AssetChangeReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            AssetChangeReportRoutingModule,
            ButtonModule,
            CalendarModule,
            DropdownModule,
            FormsModule
        ]
    }
)
export class AssetChangeReportModule {}