import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primengdevng8/tabview';
import { DropdownModule } from 'primengdevng8/dropdown';

import { InvoiceItemisedBillComponent } from './invoice.itemisedbill.component';
import { InvoiceItemisedBillRoutingModule } from './invoice.itemisedbill.route';
import { DtCommonModule } from '../../modules/dt-common.module';
import { PipeModule } from '../../modules/pipe.module';

@NgModule(
    {
        declarations: [
            InvoiceItemisedBillComponent
        ],
        imports: [
            CommonModule,
            FormsModule,
            DtCommonModule,
            InvoiceItemisedBillRoutingModule,
            ButtonModule,
            DropdownModule,
            PipeModule
        ]
    }
)
export class InvoiceItemisedBillModule { }