import { NgModule } from '@angular/core';
import { PendingDispatchComponent } from './pending-dispatch.component';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import  {ButtonModule} from 'primengdevng8/button'
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../modules/pipe.module';
import { DtCommonModule } from '../../modules/dt-common.module';
import { PendingDispatchRoutingModule } from './pending-dispatch.route';

@NgModule(
    {
        declarations:[
            PendingDispatchComponent,
        ],
        imports:[
            CommonModule,
            PendingDispatchRoutingModule,
            ButtonModule,
            FormsModule,
            PipeModule,
            DtCommonModule
        ]
    }
)
export class PendingDispatchModule {}