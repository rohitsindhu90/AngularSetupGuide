import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
import { CalendarModule } from 'primengdevng8/calendar';
import { ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { OverUsageReportComponent } from './over-usage-report.component';
import { OverUsageReportRoutingModule } from './over-usage-report.route';
import { DtCommonModule } from '../../modules/dt-common.module';

@NgModule(
    {
        declarations:[
            OverUsageReportComponent,
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            OverUsageReportRoutingModule,
            ButtonModule,
            CalendarModule,
            FormsModule,
            DropdownModule,
            DtCommonModule
        ]
    }
)
export class OverUsageReportModule {}