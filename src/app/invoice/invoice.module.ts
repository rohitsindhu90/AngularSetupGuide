import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button';
import { DtCommonModule } from '../modules/dt-common.module';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primengdevng8/tabview';
import { DropdownModule } from 'primengdevng8/dropdown';
import { InvoiceRoutingModule } from './invoice.route';
import { InvoiceComponent } from './invoice.component';
import { InvoiceFleetComponent } from './invoice.fleet.component';
import { InvoiceLinkSourceComponent } from './invoice.linksource.component';
import { ChartModule } from 'primengdevng8/chart';
import { NoInvoiceAvailableModule } from '../report/no-invoice-available/no-invoice-available.module';
import { PipeModule } from '../modules/pipe.module';

@NgModule(
    {
        declarations: [
            InvoiceComponent,
            InvoiceFleetComponent,
            InvoiceLinkSourceComponent
        ],
        imports: [
            CommonModule,
            FormsModule,
            DtCommonModule,
            InvoiceRoutingModule,
            ButtonModule,
            // CheckboxModule,
            TabViewModule,
            DropdownModule,
            ChartModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class InvoiceModule { }