import { NgModule } from '@angular/core';
import { BanDropdown } from '../sharedcomponent/bandropdown.component';
import { BenDropdown } from '../sharedcomponent/bendropdown.component';
import { BilingPlatformDropdown } from '../sharedcomponent/billingplatformdropdown.component';
import { NetworkDropdown } from '../sharedcomponent/networkdropdown.component';
import { ReportingGroupDDComponent } from '../sharedcomponent/reportinggroupdropdown.component';
import { ReportingGroupLabelComponent } from '../sharedcomponent/reportinggrouplabel.component';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primengdevng8/dropdown';
import { CommonModule } from '@angular/common';
@NgModule(
    {
        declarations: [
            BanDropdown,
            BenDropdown,
            BilingPlatformDropdown,
            NetworkDropdown,
            ReportingGroupDDComponent,
            ReportingGroupLabelComponent,
        ],
        imports: [
            FormsModule,
            DropdownModule,
            CommonModule
        ],
        exports: [
            BanDropdown,
            BenDropdown,
            BilingPlatformDropdown,
            NetworkDropdown,
            ReportingGroupDDComponent,
            ReportingGroupLabelComponent,
            FormsModule,
            DropdownModule,
            CommonModule
        ]
    }
)
export class SharedComponentModule { }