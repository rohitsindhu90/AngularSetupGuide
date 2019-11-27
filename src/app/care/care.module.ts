import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primengdevng8/button';
import { CareComponent } from './care.component';
import { CareRoutingModule } from './care.route';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { AutoCompleteExtendedModule } from 'primengdevng8/autocompleteextended';
import { CalendarModule } from 'primengdevng8/calendar';
import { KeyFilterModule } from 'primengdevng8/keyfilter';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
  {
    declarations: [
      CareComponent
    ],
    imports: [
      CommonModule,
      CareRoutingModule,
      FormsModule,
      DropdownModule,
      AutoCompleteExtendedModule,
      CalendarModule,
      KeyFilterModule,
      RequiredAsteriskModule
    ]
  }
)
export class CareModule { }
