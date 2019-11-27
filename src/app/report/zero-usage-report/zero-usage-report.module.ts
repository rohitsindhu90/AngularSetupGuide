import { NgModule } from '@angular/core';
import { ZeroUsageReportComponent } from './zero-usage-report.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { ButtonModule } from 'primengdevng8/button';
import { ZeroUsageReportRoutingModule } from './zero-usage-report.route';
import { FormsModule } from '@angular/forms';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { DropdownModule } from 'primengdevng8/dropdown';
import { PipeModule } from 'src/app/modules/pipe.module';
@NgModule(
    {
        declarations:[
            ZeroUsageReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ZeroUsageReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class ZeroUsageReportModule {}