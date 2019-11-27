import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';
import { PipeModule } from 'src/app/modules/pipe.module';
import { EuroWorldItemisedBillComponent } from './euro-world-itemisedbill.component';
import { CommonModule } from '@angular/common';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { NoInvoiceAvailableModule } from '../../no-invoice-available/no-invoice-available.module';
import { EuroWorldItemisedBillRoutingModule } from './euro-world-itemisedbill.route';

@NgModule(
    {
        declarations:[
            EuroWorldItemisedBillComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            EuroWorldItemisedBillRoutingModule,
            ButtonModule,
            DropdownModule,
            FormsModule,
            PipeModule
        ]
    }
)
export class EuroWorldItemisedBillModule {}