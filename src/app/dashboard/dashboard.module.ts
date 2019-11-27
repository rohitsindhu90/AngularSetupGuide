import { NgModule } from '@angular/core';

import { CompanyComponent } from '../company/company.component';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button'
import { DtCommonModule } from '../modules/dt-common.module';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.route';
import { BlockUIModule } from 'primengdevng8/blockui';
import { DropdownModule } from 'primengdevng8/dropdown';
import { SharedComponentModule } from '../sharedcomponent/sharedcomponent.module';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primengdevng8/tabview';
import { ChartModule } from 'primengdevng8/chart';
import { PipeModule } from '../modules/pipe.module';
import { NoInvoiceAvailableModule } from '../report/no-invoice-available/no-invoice-available.module';

@NgModule(
    {
        declarations: [
            DashboardComponent
        ],
        imports: [
            //DataTableModule,
            DtCommonModule,
            DashboardRoutingModule,
            ButtonModule,
            BlockUIModule,
            TabViewModule,
            ChartModule,
            PipeModule,
            // DropdownModule,
            // FormsModule,
            NoInvoiceAvailableModule,
            SharedComponentModule
        ]
    }
)
export class DashboardModule { }