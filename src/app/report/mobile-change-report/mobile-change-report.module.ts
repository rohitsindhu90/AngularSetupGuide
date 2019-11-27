import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { MobileChangeReportComponent } from './mobile-change-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { MobileChangeReportRoutingModule } from './mobile-change-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { CalendarModule } from 'primengdevng8/calendar';

@NgModule(
    {
        declarations:[
            MobileChangeReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            MobileChangeReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule
        ]
    }
)
export class MobileChangeReportModule {}