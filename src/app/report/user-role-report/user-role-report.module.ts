import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { UserRoleReportComponent } from './user-role-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { UserRoleReportRoutingModule } from './user-role-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CalendarModule } from 'primengdevng8/calendar';

@NgModule(
    {
        declarations:[
            UserRoleReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            UserRoleReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CalendarModule
        ]
    }
)
export class UserRoleReportModule {}