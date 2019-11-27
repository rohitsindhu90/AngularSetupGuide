import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button';
import { InternationalReportComponent } from './international-report.component';
import { InternationalReportRoutingModule } from './international-report.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            InternationalReportComponent
        ],
        imports:[
            CommonModule,
            DtCommonModule,
            InternationalReportRoutingModule,
            ButtonModule,
            DropdownModule,
            FormsModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class InternationalReportModule {}