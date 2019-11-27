import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { TopUsageReportComponent } from './top-usage-report.component';
import { TopUsageReportRoutingModule } from './top-usage-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            TopUsageReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            TopUsageReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            KeyFilterModule,
            PipeModule
        ]
    }
)
export class TopUsageReportModule {}