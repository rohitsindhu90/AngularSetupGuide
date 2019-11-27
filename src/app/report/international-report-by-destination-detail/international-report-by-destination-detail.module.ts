import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternationalReportByDestinatinDetailComponent } from './international-report-by-destination-detail.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { InternationalReportByDestinatinDetailRoutingModule } from './international-report-by-destination-detail.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';
import { MultiSelectModule } from 'primengdevng8/multiselect';


@NgModule(
    {
        declarations:[
            InternationalReportByDestinatinDetailComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            InternationalReportByDestinatinDetailRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            MultiSelectModule,
            PipeModule
        ]
    }
)
export class InternationalReportByDestinatinDetailModule {}