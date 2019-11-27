import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { CalendarModule } from 'primengdevng8/calendar';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { MostDialledNumberDetailReportRoutingModule } from './most-dialled-number-detail.route';
import { MostDialledNumberDetailReportComponent } from './most-dialled-number-detail.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            MostDialledNumberDetailReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            MostDialledNumberDetailReportRoutingModule,
            ButtonModule,
            PipeModule
        ]
    }
)
export class MostDialledNumberDetailReportModule {}