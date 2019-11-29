import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapService } from './map.service';
import { HttpClientModule } from '@angular/common/http';
import { MapPositionComponent } from './map-position/map-position.component';
import { PipesModule } from '../../pipes/pipes.module';
import { CoreModule } from '../../core/core.module';
import { MapComponent } from './map/map.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FlexLayoutModule } from '@angular/flex-layout';
import { XivapiClientModule } from '@xivapi/angular-client';
import { NavigationMapComponent } from './navigation-map/navigation-map.component';
import { WorldNavigationMapComponent } from './world-navigation-map/world-navigation-map.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FlexLayoutModule,
    XivapiClientModule,
    FormsModule,
    RouterModule,

    NgZorroAntdModule,

    PipesModule,
    CoreModule
  ],
  declarations: [
    MapPositionComponent,
    MapComponent,
    NavigationMapComponent,
    WorldNavigationMapComponent
  ],
  exports: [
    MapPositionComponent,
    MapComponent
  ],
  entryComponents: [
    MapComponent,
    NavigationMapComponent,
    WorldNavigationMapComponent
  ]
})
export class MapModule {

  static forRoot(): ModuleWithProviders<MapModule> {
    return {
      ngModule: MapModule,
      providers: [
        MapService
      ]
    };
  }
}
