import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primengdevng8/button';
import { ScheduleReportComponent } from './schedule-report.component';
import { ScheduleReportRoutingModule } from './schedule-report.route';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primengdevng8/selectbutton';
import { PickListModule } from 'primengdevng8/picklist';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
  {
    declarations: [
      ScheduleReportComponent
    ],
    imports: [
      CommonModule,
      ScheduleReportRoutingModule,
      FormsModule,
      PickListModule,
      SelectButtonModule,
      KeyFilterModule,
      RequiredAsteriskModule
    ]
  }
)
export class ScheduleReportModule { }
