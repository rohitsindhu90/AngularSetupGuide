import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataHistoryReportComponent } from './data-history-report.component';
import { DataHistoryReportRoutingModule } from './data-history-report.route';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { ButtonModule } from 'primengdevng8/button';
import { PipeModule } from 'src/app/modules/pipe.module';
import { SharedComponentModule } from 'src/app/sharedcomponent/sharedcomponent.module';

@NgModule({
  declarations: [DataHistoryReportComponent],
  imports: [
    CommonModule,
    DataHistoryReportRoutingModule,
    DropdownModule,
    NoInvoiceAvailableModule,
    DtCommonModule,
    ButtonModule,
    PipeModule,
    SharedComponentModule]
})
export class DataHistoryReportModule { }
