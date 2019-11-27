import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primengdevng8/button';
import { DtCommonModule } from '../../modules/dt-common.module';
import { CallClassComponent } from './call-class.component';
import { CallClassRoutingModule } from './call-class.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { InputSwitchModule } from 'primengdevng8/inputswitch';
import { TooltipModule } from 'primengdevng8/tooltip';
import { CallClassReportComponent } from './call-class-report.component';
import { CallClassLinkSourceComponent } from './call-class.linksource.component';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';
import { ChartModule } from 'primengdevng8/chart';
import { TabViewModule } from 'primengdevng8/tabview';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations: [
            CallClassComponent,
            CallClassReportComponent,
            CallClassLinkSourceComponent
        ],
        imports: [
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            CallClassRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            SharedComponentModule,
            InputSwitchModule,
            TooltipModule,
            ChartModule,
            TabViewModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class CallClassModule { }