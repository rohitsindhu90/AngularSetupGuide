import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
import { CalendarModule } from 'primengdevng8/calendar';
import { ButtonModule} from 'primengdevng8/button'
import { TrackingReportComponent } from './tracking-report.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { DtCommonModule } from '../../modules/dt-common.module';
import { TrackingReportRoutingModule } from './tracking-report.route';

@NgModule(
    {
        declarations:[
            TrackingReportComponent,
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            TrackingReportRoutingModule,
            ButtonModule,
            CalendarModule,
            FormsModule,
            DropdownModule,
            DtCommonModule
        ]
    }
)
export class TrackingReportModule {}