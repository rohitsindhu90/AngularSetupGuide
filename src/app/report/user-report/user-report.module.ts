import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { UserReportComponent } from './user-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { UserReportRoutingModule } from './user-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';


@NgModule(
    {
        declarations:[
            UserReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            UserReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
        ]
    }
)
export class UserReportModule {}