import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { BillingAverageTrendComponent } from './billing-average-trend.component';
import { BillingAverageTrendRoutingModule } from './billing-average-trend.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            BillingAverageTrendComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            BillingAverageTrendRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            SharedComponentModule,
            PipeModule
        ]
    }
)
export class BillingAverageTrendModule {}