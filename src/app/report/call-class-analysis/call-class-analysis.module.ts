        import { NgModule } from '@angular/core';
        import { CommonModule } from '@angular/common';
        import { DropdownModule } from 'primengdevng8/dropdown';
        import { FormsModule } from '@angular/forms';
        //import { DataTableModule } from 'primengdevng8/datatable';
        import { ButtonModule } from 'primengdevng8/button';
        import { CallClassAnalysisReportRoutingModule } from './call-class-analysis.routing.module';
        import { CallClassAnalysisComponent } from './call-class-analysis.component';
        import { PipeModule } from '../../modules/pipe.module';
import { DtCommonModule } from '../../modules/dt-common.module';


        @NgModule({
        declarations: [
            CallClassAnalysisComponent
        ],
        imports: [
            CallClassAnalysisReportRoutingModule,
            CommonModule,
            //DataTableModule,
            PipeModule,
            DropdownModule,
            FormsModule,
            ButtonModule,
            DtCommonModule
        ],
        providers:[
            
        ]
        })
        export class CallClassAnalysisReportModule { 


        }
