import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button';
import { BillingHistoricalUsageReportComponent } from './billing-historical-usage-report.component';
import { BillingHistoricalUsageReportRoutingModule } from './billing-historical-usage-report.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';

@NgModule(
    {
        declarations:[
            BillingHistoricalUsageReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            BillingHistoricalUsageReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            SharedComponentModule,
            PipeModule,
            NoInvoiceAvailableModule
        ]
    }
)
export class BillingHistoricalUsageReportModule {}