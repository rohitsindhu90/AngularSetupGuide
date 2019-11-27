import { NgModule } from '@angular/core';
import { HandsetTotalReportComponent } from './handset-total-report.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { HandsetTotalReportRoutingModule } from './handset-total-report.route';
import { ButtonModule } from 'primengdevng8/button';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            HandsetTotalReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            HandsetTotalReportRoutingModule,
            ButtonModule,
            DropdownModule,
            FormsModule,
            NoInvoiceAvailableModule,
            PipeModule  
        ]
    }
)
export class HandsetTotalReportModule {}