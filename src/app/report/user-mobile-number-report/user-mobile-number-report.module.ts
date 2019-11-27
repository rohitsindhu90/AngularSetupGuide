import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { UserMobileNumberReportComponent } from './user-mobile-number-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { UserMobileNumberReportRoutingModule } from './user-mobile-number-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';

@NgModule(
    {
        declarations:[
            UserMobileNumberReportComponent
        ],
        imports:[
            CommonModule,
            DtCommonModule,
            UserMobileNumberReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule
        ]
    }
)
export class UserMobileNumberReportModule {}