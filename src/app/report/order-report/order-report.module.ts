import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { OrderReportComponent } from './order-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { OrderReportRoutingModule } from './order-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CalendarModule } from 'primengdevng8/calendar';
import { InputSwitchModule } from 'primengdevng8/inputswitch';
import { PipeModule } from 'src/app/modules/pipe.module';


@NgModule(
    {
        declarations:[
            OrderReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            OrderReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule,
            InputSwitchModule,
            PipeModule
        ]
    }
)
export class OrderReportModule {}