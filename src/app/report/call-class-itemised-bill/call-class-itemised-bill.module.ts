import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button';
import { CallClassItemisedBillComponent } from './call-class-itemised-bill.component';
import { PipeModule } from '../../modules/pipe.module';
import { CallClassItemisedBillRoutingModule } from './call-class-itemised-bill.routing.module';
import { DtCommonModule } from '../../modules/dt-common.module';


@NgModule({
    declarations: [
        CallClassItemisedBillComponent
    ],
    imports: [
        CallClassItemisedBillRoutingModule,
        CommonModule,
        //DataTableModule,
        PipeModule,
        DropdownModule,
        FormsModule,
        ButtonModule,
        DtCommonModule
    ],
    providers: [

    ]
})
export class CallClassItemisedBillModule {


}
