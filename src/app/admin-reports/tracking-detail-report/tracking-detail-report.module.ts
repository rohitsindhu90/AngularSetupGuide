import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
import { CalendarModule } from 'primengdevng8/calendar';
import { ButtonModule} from 'primengdevng8/button';
import { FormsModule } from '@angular/forms';
import { TrackingDetailReportComponent } from './tracking-detail-report.component';
import { DropdownModule } from 'primengdevng8/dropdown';
import { DtCommonModule } from '../../modules/dt-common.module';
import { TrackingDetailReportRoutingModule } from './tracking-detail-report.route';

@NgModule(
    {
        declarations:[
            TrackingDetailReportComponent,
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            TrackingDetailReportRoutingModule,
            ButtonModule,
            CalendarModule,
            FormsModule,
            DropdownModule,
            DtCommonModule
        ]
    }
)
export class TrackingDetailReportModule {}