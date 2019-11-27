import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableModule } from 'primengdevng8/datatable';
import { CalendarModule } from 'primengdevng8/calendar';
import { ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { DataAllowanceLimitComponent } from './data-allowance-limit.component';
import { DtCommonModule } from '../../modules/dt-common.module';
import { DataAllowanceLimitRoutingModule } from './data-allowance-limit.route';

@NgModule(
    {
        declarations:[                       
            DataAllowanceLimitComponent,
            
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DataAllowanceLimitRoutingModule,
            ButtonModule,
            CalendarModule,
            FormsModule,
            DropdownModule,
            DtCommonModule
        ]
    }
)
export class DataAllowanceLimitModule {}