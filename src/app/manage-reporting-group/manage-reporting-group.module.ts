import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { ManagerReportingGroupComponent } from './manage-reporting-group.component';
import { DtCommonModule } from '../modules/dt-common.module';
import { ManagerReportingGroupRoutingModule } from './manage-reporting-group.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { RemoteValidatorModule } from '../modules/remote-validator.module';

@NgModule(
    {
        declarations:[
            ManagerReportingGroupComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            ManagerReportingGroupRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
            CheckboxModule,
            RemoteValidatorModule
        ]
    }
)
export class ManagerReportingGroupModule {}