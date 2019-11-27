import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { CalendarModule } from 'primengdevng8/calendar';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { NonGeographicDetailReportComponent } from './non-geographic-detail.component';
import { NonGeographicDetailReportRoutingModule } from './non-geographic-detail.route';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            NonGeographicDetailReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            NonGeographicDetailReportRoutingModule,
            ButtonModule,
            PipeModule
        ]
    }
)
export class NonGeographicDetailReportModule {}