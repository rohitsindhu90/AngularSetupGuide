import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { EuroWorldTravellerReportComponent } from './euro-world-traveller-report.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { EuroWorldTravellerReportRoutingModule } from './euro-world-traveller-report.route';
import { ButtonModule } from 'primengdevng8/button';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            EuroWorldTravellerReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            EuroWorldTravellerReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class EuroWorldTravellerReportModule {}