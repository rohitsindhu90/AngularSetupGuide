import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { CareReportComponent } from './care-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { CareReportRoutingModule } from './care-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CalendarModule } from 'primengdevng8/calendar';

@NgModule(
    {
        declarations:[
            CareReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            CareReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule
        ]
    }
)
export class CareReportModule {}