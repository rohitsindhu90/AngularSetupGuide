import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { InternationalReportByDestinationComponent } from './international-report-by-destination.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { InternationalReportByDestinationRoutingModule } from './international-report-by-destination.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            InternationalReportByDestinationComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            InternationalReportByDestinationRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class InternationalReportByDestinationModule {}