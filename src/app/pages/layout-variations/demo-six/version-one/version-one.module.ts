import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgMaterialMultilevelMenuModule } from './../../../../../../projects/ng-material-multilevel-menu/src/public_api';
import { MaterialsModule } from './../../../../modules/materials.module';

import { VersionOneRoutingModule } from './version-one-routing.module';
import { VersionOneComponent } from './version-one.component';


@NgModule({
  declarations: [VersionOneComponent],
  imports: [
    CommonModule,
    VersionOneRoutingModule,
    NgMaterialMultilevelMenuModule,
    MaterialsModule
  ]
})
export class VersionOneModule { }
