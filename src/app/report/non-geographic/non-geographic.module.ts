import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { DtCommonModule } from '../../modules/dt-common.module';
import { CalendarModule } from 'primengdevng8/calendar';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { NonGeographicReportComponent } from './non-geographic.component';
import { NonGeographicReportRoutingModule } from './non-geographic.route';
import { PipeModule } from 'src/app/modules/pipe.module';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';

@NgModule(
    {
        declarations:[
            NonGeographicReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            NonGeographicReportRoutingModule,
            ButtonModule,
            DropdownModule,
            FormsModule,
            PipeModule,
            NoInvoiceAvailableModule
        ]
    }
)
export class NonGeographicReportModule {}