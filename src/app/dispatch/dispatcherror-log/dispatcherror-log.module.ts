import { NgModule } from '@angular/core';
import { DispatchErrorLogComponent } from '../dispatcherror-log/dispatcherror-log.component';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule } from 'primengdevng8/button'
import { DispatchErrorLogRoutingModule } from './dispatcherror-log.route';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../../modules/pipe.module';
import { DtCommonModule } from '../../modules/dt-common.module';

@NgModule(
    {
        declarations: [
            DispatchErrorLogComponent,            
        ],
        imports: [
            CommonModule,
            //DataTableModule,
            DispatchErrorLogRoutingModule,
            ButtonModule,
            FormsModule,
            PipeModule,
            DtCommonModule
        ]
    }
)
export class DispatchErrorLogModule { }