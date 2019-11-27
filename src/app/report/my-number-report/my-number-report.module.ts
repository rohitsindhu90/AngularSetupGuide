import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyNumberReportRoutingModule } from './my-number-report.route';
import { MyNumberComponent } from './my-number-report.component';
import { DataTableModule } from 'primengdevng8/datatable';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/modules/pipe.module';
import { ChartModule } from 'primengdevng8/chart';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';


@NgModule({
  declarations: [MyNumberComponent],
  imports: [
    CommonModule,
    MyNumberReportRoutingModule,
    DataTableModule,
    DtCommonModule,
    DropdownModule,
    FormsModule,
    PipeModule,
    //DatePipe,
    ChartModule,
    NoInvoiceAvailableModule
   
  ]
})
export class MyNumberReportModule { }
