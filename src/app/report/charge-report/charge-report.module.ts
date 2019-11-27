import { NgModule } from '@angular/core';
import { ChargeReportComponent } from './charge-report.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { ChargeReportRoutingModule } from './charge-report.route';
import { ButtonModule } from 'primengdevng8/button';
import { FormsModule } from '@angular/forms';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { DropdownModule } from 'primengdevng8/dropdown';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            ChargeReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ChargeReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class ChargeReportModule {}