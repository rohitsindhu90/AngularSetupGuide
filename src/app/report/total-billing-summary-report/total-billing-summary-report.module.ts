import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ButtonModule } from 'primengdevng8/button';

//component
import { TotalBillingSummaryReportRoutingModule } from './total-billing-summary-report.routing.module';
import { TotalBillingSummaryReportComponent } from './total-billing-summary-report.component';

import { FormsModule } from '@angular/forms';
//import { DataTableModule } from 'primengdevng8/datatable';
//import { CurrencyFormatPipe } from '../_common/custom.pipe';
import { PipeModule } from '../../modules/pipe.module';
import { DtCommonModule } from '../../modules/dt-common.module';
import { SharedComponentModule } from '../../sharedcomponent/sharedcomponent.module';


@NgModule({
  declarations: [
    TotalBillingSummaryReportComponent,
    
    
    
  ],
  imports: [
    CommonModule,
    //DataTableModule,    
    DropdownModule,
    TotalBillingSummaryReportRoutingModule,
    FormsModule,
    ButtonModule,
    PipeModule,
    DtCommonModule,
    SharedComponentModule
  ],
  providers:[
       
  ]
})
export class TotalBillingSummaryReportModule { 


}
