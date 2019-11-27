import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { ReportingGroupRelRoutingModule } from './reporting-group-relationship.route';
import { FormsModule } from '@angular/forms';
import { ReportingGroupRelComponent } from './reporting-group-relationship.component';
import { RadioButtonModule } from 'primengdevng8/radiobutton';
import { DropdownModule } from 'primengdevng8/dropdown';
import { PickListModule } from 'primengdevng8/picklist';

@NgModule(
    {
        declarations:[
            ReportingGroupRelComponent
        ],
        imports:[
            CommonModule,
            ReportingGroupRelRoutingModule,
            FormsModule,
            RadioButtonModule,
            DropdownModule,
            PickListModule
        ]
    }
)
export class ReportingGroupRelModule {}