import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
import { CalendarModule } from 'primengdevng8/calendar';
import { ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { ClientTransactionComponent } from '../client-transaction/client-transaction-report.component';
import { DtCommonModule } from '../../modules/dt-common.module';
import { ClientTransactionRoutingModule } from './client-transaction.route';

@NgModule(
    {
        declarations:[
            ClientTransactionComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            ClientTransactionRoutingModule,
            ButtonModule,
            CalendarModule,
            FormsModule,
            DropdownModule,
            DtCommonModule
        ]
    }
)
export class ClientTransactionModule {}