import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpareNumberReportComponent } from './spare-number-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { SpareNumberReportRoutingModule } from './spare-number-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';
import { CalendarModule } from 'primengdevng8/calendar';
@NgModule(
    {
        declarations:[
            SpareNumberReportComponent,
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            SpareNumberReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule,
        ]
    }
)
export class SpareNumberReportModule {}