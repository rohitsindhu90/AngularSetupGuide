import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { DataTableModule } from 'primengdevng8/datatable';
import { ButtonModule} from 'primengdevng8/button';
import { RoamedReportComponent } from './roamed-report.component';
import { DtCommonModule } from 'src/app/modules/dt-common.module';
import { RoamedReportRoutingModule } from './roamed-report.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { NoInvoiceAvailableModule } from '../no-invoice-available/no-invoice-available.module';
import { NewClientProductImportViewModel } from 'src/app/_models/Admin/newcompanysetupviewmodel';
import { PipeModule } from 'src/app/modules/pipe.module';

@NgModule(
    {
        declarations:[
            RoamedReportComponent
        ],
        imports:[
            CommonModule,
            //DataTableModule,
            DtCommonModule,
            RoamedReportRoutingModule,
            ButtonModule,
            FormsModule,
            DropdownModule,
            NoInvoiceAvailableModule,
            PipeModule
        ]
    }
)
export class RoamedReportModule {}