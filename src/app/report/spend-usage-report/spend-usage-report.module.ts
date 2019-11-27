import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button';
import { SpendUsageReportComponent } from './spend-usage-report.component';
import { SpendUsageReportRoutingModule } from './spend-usage-report.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            SpendUsageReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            SpendUsageReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class SpendUsageReportModule {}