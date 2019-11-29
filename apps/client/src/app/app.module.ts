import { BrowserModule } from '@angular/platform-browser';
import { NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgSerializerModule } from '@kaiu/ng-serializer';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgDragDropModule } from 'ng-drag-drop';
import { IS_ELECTRON, PlatformService } from './core/tools/platform.service';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { en_US, NgZorroAntdModule, NZ_CONFIG, NZ_I18N, NZ_ICONS, NzConfig } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PipesModule } from './pipes/pipes.module';
import { authReducer, initialState as authInitialState } from './+state/auth.reducer';
import { AuthEffects } from './+state/auth.effects';
import { AuthModule } from './core/auth/auth.module';
import { AlarmsSidebarModule } from './modules/alarms-sidebar/alarms-sidebar.module';
import { AlarmsModule } from './core/alarms/alarms.module';
import { ListModule } from './modules/list/list.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { XivapiClientModule } from '@xivapi/angular-client';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { TranslationsLoaderFactory } from './translations-loader';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  AppstoreOutline,
  ArrowRightOutline,
  BellOutline,
  BookOutline,
  BuildOutline,
  CodeOutline,
  DesktopOutline,
  EnvironmentOutline,
  ExperimentOutline,
  FileDoneOutline,
  FileTextOutline,
  FilterOutline,
  FormOutline,
  HomeOutline,
  HourglassOutline,
  InfoOutline,
  LayoutOutline,
  LineChartOutline,
  LockOutline,
  LoginOutline,
  MessageOutline,
  NotificationOutline,
  PlusOutline,
  ProfileOutline,
  ReloadOutline,
  SelectOutline,
  SettingOutline,
  ShareAltOutline,
  ShoppingOutline,
  SolutionOutline,
  UsergroupAddOutline
} from '@ant-design/icons-angular/icons';
import { UniversalInterceptor } from './universal-interceptor';
import { DirtyModule } from './core/dirty/dirty.module';
import { TeamsModule } from './modules/teams/teams.module';
import { SettingsModule } from './modules/settings/settings.module';
import { UserAvatarModule } from './modules/user-avatar/user-avatar.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SimulatorModule } from './pages/simulator/simulator.module';
import { RotationsModule } from './modules/rotations/rotations.module';
import { CustomLinksModule } from './modules/custom-links/custom-links.module';
import { PageLoaderModule } from './modules/page-loader/page-loader.module';
import { MapModule } from './modules/map/map.module';
import { LoadingScreenModule } from './pages/loading-screen/loading-screen.module';
import { WorkshopModule } from './modules/workshop/workshop.module';
import { LayoutModule } from '@angular/cdk/layout';
import { CustomItemsModule } from './modules/custom-items/custom-items.module';
import { TransferHttpCacheModule } from '@nguniversal/common';
import en from '@angular/common/locales/en';
import fr from '@angular/common/locales/fr';
import de from '@angular/common/locales/de';
import ja from '@angular/common/locales/ja';
import zh from '@angular/common/locales/zh';
import ru from '@angular/common/locales/ru';
import es from '@angular/common/locales/es';
import pt from '@angular/common/locales/pt';
import hr from '@angular/common/locales/hr';
import ko from '@angular/common/locales/ko';
import { ClipboardModule } from 'ngx-clipboard';
import { InventoryModule } from './modules/inventory/inventory.module';
import { EorzeaModule } from './modules/eorzea/eorzea.module';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { GraphQLModule } from './graphql.module';
import { ApolloInterceptor } from './apollo-interceptor';

const icons: IconDefinition[] = [
  SettingOutline,
  NotificationOutline,
  FormOutline,
  LoginOutline,
  ProfileOutline,
  SolutionOutline,
  BuildOutline,
  BellOutline,
  EnvironmentOutline,
  BookOutline,
  FileDoneOutline,
  MessageOutline,
  DesktopOutline,
  ShareAltOutline,
  ReloadOutline,
  FilterOutline,
  SelectOutline,
  InfoOutline,
  ArrowRightOutline,
  PlusOutline,
  ExperimentOutline,
  LockOutline,
  LayoutOutline,
  UsergroupAddOutline,
  LineChartOutline,
  ShoppingOutline,
  CodeOutline,
  FileTextOutline,
  AppstoreOutline,
  HourglassOutline,
  HomeOutline
];

registerLocaleData(en);
registerLocaleData(fr);
registerLocaleData(de);
registerLocaleData(ja);
registerLocaleData(zh);
registerLocaleData(es);
registerLocaleData(pt);
registerLocaleData(hr);
registerLocaleData(ru);
registerLocaleData(ko);

const nzConfig: NzConfig = {
  message: {
    nzDuration: 10000,
    nzMaxStack: 8,
    nzPauseOnHover: true,
    nzAnimate: true,
    nzTop: '92px'
  }
};

@NgModule({
  declarations: [
    AppComponent
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: NZ_CONFIG,
      useValue: nzConfig
    },
    { provide: FirestoreSettingsToken, useValue: {} },
    { provide: NZ_ICONS, useValue: icons },
    { provide: HTTP_INTERCEPTORS, useClass: UniversalInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ApolloInterceptor, multi: true }
  ],
  imports: [
    FlexLayoutModule,

    NgDragDropModule.forRoot(),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: TranslationsLoaderFactory,
        deps: [HttpClient, PLATFORM_ID, PlatformService]
      }
    }),

    AngularFireModule.initializeApp(environment.firebase),

    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireFunctionsModule,

    XivapiClientModule.forRoot(),

    RouterModule.forRoot([], { useHash: IS_ELECTRON }),
    DirtyModule,

    AppRoutingModule,
    AuthModule,
    ListModule,
    WorkshopModule,
    TeamsModule,
    LayoutModule,
    NotificationsModule,
    SettingsModule.forRoot(),
    MapModule.forRoot(),
    UserAvatarModule,
    SimulatorModule,
    RotationsModule,
    CustomLinksModule,
    CustomItemsModule,
    PageLoaderModule,
    LoadingScreenModule,

    AlarmsModule,
    AlarmsSidebarModule,

    InventoryModule,
    EorzeaModule,

    HttpClientModule,

    BrowserAnimationsModule,

    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    TransferHttpCacheModule,
    FormsModule,
    ReactiveFormsModule,

    NgSerializerModule.forRoot(),

    AppRoutingModule,
    CoreModule.forRoot(),
    PipesModule,

    NgZorroAntdModule,
    NgDragDropModule.forRoot(),
    NgxDnDModule,

    StoreModule.forRoot({}, {}),
    !environment.production ? StoreDevtoolsModule.instrument({
      name: 'FFXIV Teamcraft'
    }) : [],
    EffectsModule.forRoot([]),
    StoreModule.forFeature('auth', authReducer, { initialState: authInitialState }),
    EffectsModule.forFeature([AuthEffects]),
    ClipboardModule,
    GraphQLModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
