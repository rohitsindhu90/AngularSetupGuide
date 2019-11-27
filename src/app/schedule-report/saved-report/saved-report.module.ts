import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule} from 'primengdevng8/button';
import { SavedReportComponent } from './saved-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { SavedReportRoutingModule } from './saved-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';

@NgModule(
    {
        declarations:[
            SavedReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            SavedReportRoutingModule,
            FormsModule,
            DropdownModule,
            ButtonModule,
        ]
    }
)
export class SavedReportModule {}