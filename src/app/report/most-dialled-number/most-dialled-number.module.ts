import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button'
import { DtCommonModule } from '../../modules/dt-common.module';
import { CalendarModule } from 'primengdevng8/calendar';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { MostDialledNumberReportComponent } from './most-dialled-number.component';
import { MostDialledNumberReportRoutingModule } from './most-dialled-number.route';
import { CurrencyFormatPipe } from 'src/app/_common/custom.pipe';
import { PipeModule } from 'src/app/modules/pipe.module';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';

@NgModule(
    {
        declarations:[
            MostDialledNumberReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            MostDialledNumberReportRoutingModule,
            ButtonModule,
            DropdownModule,
            FormsModule,
            PipeModule,
            NoInvoiceAvailableModule
        ]
    }
)
export class MostDialledNumberReportModule {}