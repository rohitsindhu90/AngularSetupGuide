import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryCostByReportingGroupComponent } from './history-cost-by-reporting-group.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { HistoryCostByReportingGroupRoutingModule } from './history-cost-by-reporting-group.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            HistoryCostByReportingGroupComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            HistoryCostByReportingGroupRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class HistoryCostByReportingGroupModule {}