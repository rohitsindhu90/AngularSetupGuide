import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { ZeroUsageByMonthReportComponent } from './zero-usage-by-month-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { ZeroUsageByMonthReportRoutingModule } from './zero-usage-by-month-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            ZeroUsageByMonthReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ZeroUsageByMonthReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class ZeroUsageByMonthReportModule {}