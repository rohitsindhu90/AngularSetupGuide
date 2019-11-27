import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoamedReportItemisedComponent } from './roamed-report-itemised.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { RoamedReportItemisedRoutingModule } from './roamed-report-itemised.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';
@NgModule(
    {
        declarations: [
            RoamedReportItemisedComponent
        ],
        imports: [
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            RoamedReportItemisedRoutingModule,
            DropdownModule,
            FormsModule,
            PipeModule,
            ButtonModule

        ]
    }
)
export class RoamedReportItemisedModule { }