import { NgModule } from '@angular/core';
import { DropdownModule } from 'primengdevng8/dropdown';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ChargeDetailReportComponent } from './charge-detail-report.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { ChargeDetailReportRoutingModule } from './charge-detail-report.route';
import { ButtonModule } from 'primengdevng8/button';
import { FormsModule } from '@angular/forms';
import { NoInvoiceAvailableModule } from '../../no-invoice-available/no-invoice-available.module';

@NgModule(
    {
        declarations:[
            ChargeDetailReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ChargeDetailReportRoutingModule,
            ButtonModule,
            PipeModule
        ]
    }
)
export class ChargeDetailReportModule {}