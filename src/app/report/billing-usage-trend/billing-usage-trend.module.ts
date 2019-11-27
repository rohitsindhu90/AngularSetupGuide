import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { BillingUsageTrendComponent } from './billing-usage-trend.component';
import { BillingUsageTrendRoutingModule } from './billing-usage-trend.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            BillingUsageTrendComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            BillingUsageTrendRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            SharedComponentModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class BillingUsageTrendModule {}