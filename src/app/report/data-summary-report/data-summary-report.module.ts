import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { DataSummaryReportComponent } from './data-summary-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { DataSummaryReportRoutingModule } from './data-summary-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            DataSummaryReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            DataSummaryReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            SharedComponentModule,
            PipeModule
        ]
    }
)
export class DataSummaryReportModule {}