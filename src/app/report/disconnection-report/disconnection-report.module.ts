import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { CalendarModule } from 'primengdevng8/calendar';
import { DisconnectionReportComponent } from './disconnection-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { DisconnectionReportRoutingModule } from './disconnection-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';

@NgModule(
    {
        declarations:[
            DisconnectionReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            DisconnectionReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule
        ]
    }
)
export class DisconnectionReportModule {}