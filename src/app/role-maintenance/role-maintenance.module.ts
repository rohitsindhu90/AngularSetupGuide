import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeTableModule} from 'primengdevng8/treetable';
import { RoleMaintenanceRoutingModule } from './role-maintenance.route';
import { RoleMaintenanceComponent } from './role-maintenance.component';
import { DropdownModule } from 'primengdevng8/dropdown';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primengdevng8/checkbox';
import { RequiredAsteriskModule } from '../modules/requiredasterisk.module';

@NgModule(
    {
        declarations:[
            RoleMaintenanceComponent
        ],
        imports:[
            CommonModule,
            FormsModule,
            TreeTableModule,
            DropdownModule,
            CheckboxModule,
            RoleMaintenanceRoutingModule,
            RequiredAsteriskModule
        ]
    }
)
export class RoleMaintenanceModule {}