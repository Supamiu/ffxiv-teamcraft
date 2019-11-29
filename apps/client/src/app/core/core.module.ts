import { ErrorHandler, ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { GarlandToolsService } from './api/garland-tools.service';
import { DataService } from './api/data.service';
import { NgSerializerModule } from '@kaiu/ng-serializer';
import { I18nPipe } from './i18n.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedDataService } from './data/localized-data.service';
import { PushNotificationsModule } from 'ng-push';
import { AbstractNotification } from './notification/abstract-notification';
import { ListCommentNotification } from '../model/notification/list-comment-notification';
import { PendingChangesService } from './database/pending-changes/pending-changes.service';
import { PlatformService } from './tools/platform.service';
import { MathToolsService } from './tools/math-tools';
import { I18nToolsService } from './tools/i18n-tools.service';
import { EorzeanTimeService } from './eorzea/eorzean-time.service';
import { TimerPipe } from './eorzea/timer.pipe';
import { HtmlToolsService } from './tools/html-tools.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LinkToolsService } from './tools/link-tools.service';
import { CharacterService } from './api/character.service';
import { DiscordWebhookService } from './discord/discord-webhook.service';
import { ListItemCommentNotification } from '../model/notification/list-item-comment-notification';
import { MaintenanceModule } from '../pages/maintenance/maintenance.module';
import { PatreonService } from './patreon/patreon.service';
import { CustomLink } from './database/custom-links/custom-link';
import { ListTemplate } from './database/custom-links/list-template';
import { WeatherService } from './eorzea/weather.service';
import { DbButtonComponent } from './db-button/db-button.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { RouterModule } from '@angular/router';
import { ItemRarityDirective } from './item-rarity/item-rarity.directive';
import { DbItemCommentNotification } from '../model/notification/db-item-comment-notification';
import { DbCommentReplyNotification } from '../model/notification/db-comment-reply-notification';
import { AdminGuard } from './guard/admin.guard';
import { BlogPostNotification } from '../model/notification/blog-post-notification';
import { ErrorInterceptor } from './interceptor/error-interceptor';
import { TeamcraftErrorHandler } from './error-handler/teamcraft-error-handler';
import { DevGuard } from './guard/dev.guard';
import { DATA_REPORTERS } from './data-reporting/data-reporters-index';
import { VersionLockModule } from '../pages/version-lock/version-lock.module';


@NgModule({
  imports: [
    HttpClientModule,
    NgSerializerModule.forChild([
      {
        parent: AbstractNotification,
        children: {
          LIST_COMMENT: ListCommentNotification,
          LIST_ITEM_COMMENT: ListItemCommentNotification,
          DB_ITEM_COMMENT: DbItemCommentNotification,
          DB_COMMENT_REPLY: DbCommentReplyNotification,
          BLOG_POST: BlogPostNotification
        }
      },
      {
        parent: CustomLink,
        children: {
          link: CustomLink,
          template: ListTemplate
        }
      }
    ]),
    TranslateModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    PushNotificationsModule,
    MaintenanceModule,
    VersionLockModule,
    NgZorroAntdModule,
    RouterModule
  ],
  providers: [
    PendingChangesService,
    PlatformService,
    DataService,
    MathToolsService,
    I18nToolsService,
    HtmlToolsService,
    LinkToolsService,
    DiscordWebhookService,
    PatreonService,
    WeatherService,
    AdminGuard,
    DevGuard,
    ...DATA_REPORTERS,
    { provide: ErrorHandler, useClass: TeamcraftErrorHandler }
  ],
  declarations: [
    I18nPipe,
    TimerPipe,
    DbButtonComponent,
    ItemRarityDirective
  ],
  exports: [
    I18nPipe,
    TranslateModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    PushNotificationsModule,
    MaintenanceModule,
    TimerPipe,
    DbButtonComponent,
    ItemRarityDirective
  ]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        GarlandToolsService,
        EorzeanTimeService,
        CharacterService,
        LocalizedDataService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
      ]
    };
  }
}
