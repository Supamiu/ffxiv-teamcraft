import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, Type, ViewChild } from '@angular/core';
import { ListRow } from '../../../modules/list/model/list-row';
import { ListsFacade } from '../../../modules/list/+state/lists.facade';
import { AlarmsFacade } from '../../../core/alarms/+state/alarms.facade';
import { AlarmDisplay } from '../../../core/alarms/alarm-display';
import { AlarmGroup } from '../../../core/alarms/alarm-group';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { Alarm } from '../../../core/alarms/alarm';
import { NzMessageService, NzModalService, NzNotificationService } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { LocalizedDataService } from '../../../core/data/localized-data.service';
import { I18nToolsService } from '../../../core/tools/i18n-tools.service';
import { ItemDetailsPopup } from '../item-details/item-details-popup';
import { GatheredByComponent } from '../item-details/gathered-by/gathered-by.component';
import {
  distinctUntilChanged,
  exhaustMap,
  filter,
  first,
  map,
  mergeMap,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { HuntingComponent } from '../item-details/hunting/hunting.component';
import { InstancesComponent } from '../item-details/instances/instances.component';
import { ReducedFromComponent } from '../item-details/reduced-from/reduced-from.component';
import { VendorsComponent } from '../item-details/vendors/vendors.component';
import { VenturesComponent } from '../item-details/ventures/ventures.component';
import { VoyagesComponent } from '../item-details/voyages/voyages.component';
import { TradesComponent } from '../item-details/trades/trades.component';
import { PermissionLevel } from '../../../core/database/permissions/permission-level.enum';
import { XivapiService } from '@xivapi/angular-client';
import { UserService } from '../../../core/database/user.service';
import { AuthFacade } from '../../../+state/auth.facade';
import { RelationshipsComponent } from '../item-details/relationships/relationships.component';
import { Team } from '../../../model/team/team';
import { TeamsFacade } from '../../../modules/teams/+state/teams.facade';
import { DiscordWebhookService } from '../../../core/discord/discord-webhook.service';
import { CommentsPopupComponent } from '../../../modules/comments/comments-popup/comments-popup.component';
import { CommentTargetType } from '../../../modules/comments/comment-target-type';
import { List } from '../../../modules/list/model/list';
import { ListItemCommentNotification } from '../../../model/notification/list-item-comment-notification';
import { RotationPickerService } from '../../../modules/rotations/rotation-picker.service';
import { NumberQuestionPopupComponent } from '../../../modules/number-question-popup/number-question-popup/number-question-popup.component';
import { ListManagerService } from '../../../modules/list/list-manager.service';
import { SettingsService } from '../../../modules/settings/settings.service';
import { Craft } from '../../../model/garland-tools/craft';
import { CommentsService } from '../../../modules/comments/comments.service';
import { ListLayout } from '../../../core/layout/list-layout';
import { CustomItem } from '../../../modules/custom-items/model/custom-item';
import { ListPickerService } from '../../../modules/list-picker/list-picker.service';
import { ProgressPopupService } from '../../../modules/progress-popup/progress-popup.service';
import { ItemRowMenuElement } from '../../../model/display/item-row-menu-element';
import * as _ from 'lodash';
import { TeamcraftComponent } from '../../../core/component/teamcraft-component';
import { TreasuresComponent } from '../item-details/treasures/treasures.component';
import { FatesComponent } from '../item-details/fates/fates.component';
import { DesynthsComponent } from '../item-details/desynth/desynths.component';
import { CraftingRotation } from '../../../model/other/crafting-rotation';
import { MacroPopupComponent } from '../../simulator/components/macro-popup/macro-popup.component';
import { CraftingActionsRegistry } from '@ffxiv-teamcraft/simulator';
import { foods } from '../../../core/data/sources/foods';
import { medicines } from '../../../core/data/sources/medicines';
import { freeCompanyActions } from '../../../core/data/sources/free-company-actions';
import { ConsumablesService } from '../../simulator/model/consumables.service';
import { FreeCompanyActionsService } from '../../simulator/model/free-company-actions.service';
import { MarketboardPopupComponent } from '../../../modules/marketboard/marketboard-popup/marketboard-popup.component';
import { InventoryFacade } from '../../../modules/inventory/+state/inventory.facade';
import { UserInventory } from '../../../model/user/inventory/user-inventory';

@Component({
  selector: 'app-item-row',
  templateUrl: './item-row.component.html',
  styleUrls: ['./item-row.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemRowComponent extends TeamcraftComponent implements OnInit {

  private buttonsCache = {};

  private _item$: Subject<ListRow> = new Subject<ListRow>();

  public item$: Observable<ListRow> = this._item$.pipe(
    distinctUntilChanged((a, b) => {
      return a.id === b.id && a.amount === b.amount && a.done === b.done;
    }),
    shareReplay(1)
  );

  private finalItem$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  @Input()
  set item(item: ListRow) {
    this._item$.next(item);
    this.handleAlarms(item);
  }

  @Input()
  public set finalItem(final: boolean) {
    this.finalItem$.next(final);
  }

  public get finalItem(): boolean {
    return this.finalItem$.value;
  }

  @Input()
  odd = false;

  @Input()
  public set layout(l: ListLayout) {
    if (l) {
      Object.keys(ItemRowMenuElement)
        .forEach(key => {
          this.buttonsCache[ItemRowMenuElement[key]] = l.rowsDisplay.buttons.indexOf(ItemRowMenuElement[key]) > -1;
        });
    }
    this._layout = l;
  }

  public get layout(): ListLayout {
    return this._layout;
  }

  _layout: ListLayout;

  alarms: Alarm[] = [];

  moreAlarmsAvailable = 0;

  @Input()
  permissionLevel: PermissionLevel;

  @Input()
  alarmGroups: AlarmGroup[];

  userId$: Observable<string>;

  loggedIn$: Observable<boolean>;

  requiredForFinalCraft$: Observable<number>;

  team$: Observable<Team>;

  missingBooks$: Observable<number[]>;

  commentBadge$: Observable<boolean>;

  commentBadgeReloader$: BehaviorSubject<void> = new BehaviorSubject<void>(null);

  tagInputVisible = false;

  newTag: string;

  private list$: Observable<List> = this.listsFacade.selectedList$;

  @ViewChild('inputElement') inputElement: ElementRef;

  amountInInventory$: Observable<{ containerName: string, amount: number, hq: boolean, isRetainer: boolean }[]> = this.item$.pipe(
    switchMap(item => {
      return this.inventoryService.inventory$.pipe(
        map((inventory: UserInventory) => {
          return inventory.getItem(item.id).map(entry => {
            return {
              isRetainer: entry.retainerName !== undefined,
              containerName: entry.retainerName ? entry.retainerName : this.inventoryService.getContainerName(entry.containerId),
              amount: entry.quantity,
              hq: entry.hq
            };
          }).reduce((res, entry) => {
            const resEntry = res.find(e => e.containerName === entry.containerName && e.hq === entry.hq);
            if (resEntry !== undefined) {
              resEntry.amount += entry.amount;
            } else {
              res.push(entry);
            }
            return res;
          }, []);
        })
      );
    })
  );

  itemTags$ = combineLatest([this.item$, this.authFacade.user$]).pipe(
    map(([item, user]) => {
      return (user.itemTags || [])
        .filter(entry => entry.id === item.id)
        .map(entry => entry.tag);
    })
  );

  tagInput$ = new BehaviorSubject<string>('');

  availableTags$ = combineLatest([this.tagInput$, this.authFacade.user$]).pipe(
    map(([input, user]) => {
      return _.uniq(user.itemTags
        .filter(entry => entry.tag.toLowerCase().indexOf(input.toLowerCase()) > -1)
        .map(entry => entry.tag));
    })
  );

  itemRowTypes = ItemRowMenuElement;

  showLogCompletionButton$ = combineLatest([this.authFacade.user$, this.item$]).pipe(
    map(([user, item]) => {
      if (item.craftedBy !== undefined && item.craftedBy.length > 0) {
        return user.logProgression.indexOf(+item.recipeId || +item.craftedBy[0].recipeId) === -1;
      } else if (item.gatheredBy !== undefined) {
        return user.gatheringLogProgression.indexOf(+item.id) === -1;
      }
      return false;
    }),
    shareReplay(1)
  );

  constructor(public listsFacade: ListsFacade, private alarmsFacade: AlarmsFacade,
              private messageService: NzMessageService, private translate: TranslateService,
              private modal: NzModalService, private l12n: LocalizedDataService,
              private i18n: I18nToolsService, private cdRef: ChangeDetectorRef,
              private userService: UserService, private xivapi: XivapiService,
              private authFacade: AuthFacade, private teamsFacade: TeamsFacade,
              private discordWebhookService: DiscordWebhookService,
              public settings: SettingsService,
              private listManager: ListManagerService,
              private rotationPicker: RotationPickerService,
              private commentsService: CommentsService,
              private listPicker: ListPickerService,
              private progressService: ProgressPopupService,
              private notificationService: NzNotificationService,
              public consumablesService: ConsumablesService,
              public freeCompanyActionsService: FreeCompanyActionsService,
              private inventoryService: InventoryFacade) {
    super();

    combineLatest([this.settings.settingsChange$, this.item$]).pipe(takeUntil(this.onDestroy$)).subscribe(([, item]) => {
      this.handleAlarms(item);
      this.cdRef.detectChanges();
    });

    this.missingBooks$ = combineLatest([this.authFacade.mainCharacterEntry$, this.item$]).pipe(
      map(([entry, item]) => {
        return (item.masterbooks || [])
        // Ignore string ids, as they are draft ids
          .filter(book => (<any>book.id.toString()) !== (<any>book.id))
          .filter(book => (entry.masterbooks || []).indexOf(book.id) === -1)
          .map(book => book.id);
      })
    );

    this.userId$ = this.authFacade.userId$;
    this.loggedIn$ = this.authFacade.loggedIn$;
    this.team$ = combineLatest([this.list$, this.teamsFacade.selectedTeam$]).pipe(
      map(([list, team]) => {
        if (list.teamId === undefined || (team && list.teamId !== team.$key)) {
          return null;
        }
        return team;
      }),
      shareReplay(1)
    );

    this.requiredForFinalCraft$ = combineLatest([this.list$, this.item$]).pipe(
      map(([list, item]) => {
        const recipesNeedingItem = list.finalItems
          .filter(i => i.requires !== undefined)
          .filter(i => {
            return (i.requires || []).some(req => req.id === item.id);
          });
        if (item.requiredAsHQ) {
          return item.amount;
        }
        if (list.disableHQSuggestions) {
          return 0;
        }
        if (recipesNeedingItem.length === 0 || item.requiredAsHQ === false) {
          return 0;
        } else {
          let count = 0;
          recipesNeedingItem.forEach(recipe => {
            count += recipe.requires.find(req => req.id === item.id).amount * recipe.amount;
          });
          return count;
        }
      })
    );
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.cdRef.detectChanges();
    });

    this.commentBadge$ = this.commentBadgeReloader$.pipe(
      exhaustMap(() => combineLatest([this.list$, this.item$.pipe(map(i => i.id))])),
      switchMap(([list, itemId]) => {
        return this.commentsService.getComments(
          CommentTargetType.LIST,
          list.$key,
          `${this.finalItem ? 'finalItems' : 'items'}:${itemId}`
        );
      }),
      map(comments => comments.length > 0),
      startWith(false)
    );
  }

  openMarketboardDialog(item: ListRow): void {
    this.modal.create({
      nzTitle: `${this.translate.instant('MARKETBOARD.Title')} - ${this.i18n.getName(this.l12n.getItem(item.id))}`,
      nzContent: MarketboardPopupComponent,
      nzComponentParams: {
        itemId: item.id,
        showHistory: true
      },
      nzFooter: null,
      nzWidth: '80vw'
    });
  }

  attachRotation(item: ListRow): void {
    const entry = item.craftedBy[0];
    const craft: Partial<Craft> = {
      id: entry.recipeId,
      job: entry.jobId,
      lvl: entry.level,
      stars: entry.stars_tooltip.length,
      rlvl: entry.rlvl,
      durability: entry.durability,
      progress: entry.progression,
      quality: entry.quality
    };
    this.rotationPicker.pickRotation(item.id, craft.id, craft)
      .pipe(
        filter(rotation => rotation !== null)
      )
      .subscribe(rotation => {
        item.attachedRotation = rotation.$key;
        this.saveItem(item);
      });
  }

  detachRotation(item: ListRow): void {
    delete item.attachedRotation;
    this.saveItem(item);
  }

  openRotationMacroPopup(rotation: CraftingRotation, item: ListRow): void {
    const foodsData = this.consumablesService.fromData(foods);
    const medicinesData = this.consumablesService.fromData(medicines);
    const freeCompanyActionsData = this.freeCompanyActionsService.fromData(freeCompanyActions);
    this.modal.create({
      nzContent: MacroPopupComponent,
      nzComponentParams: {
        rotation: CraftingActionsRegistry.deserializeRotation(rotation.rotation),
        job: item.craftedBy[0].jobId,
        food: foodsData.find(f => rotation.food && f.itemId === rotation.food.id && f.hq === rotation.food.hq),
        medicine: medicinesData.find(m => rotation.medicine && m.itemId === rotation.medicine.id && m.hq === rotation.medicine.hq),
        freeCompanyActions: freeCompanyActionsData.filter(action => rotation.freeCompanyActions.indexOf(action.actionId) > -1)
      },
      nzTitle: this.translate.instant('SIMULATOR.Generate_ingame_macro'),
      nzFooter: null
    });
  }

  showTagInput(): void {
    this.tagInputVisible = true;
    setTimeout(() => {
      this.inputElement.nativeElement.focus();
    }, 10);
  }

  markAsDoneInLog(item: ListRow): void {
    this.authFacade.user$.pipe(
      first()
    ).subscribe(user => {
      if (item.craftedBy !== undefined && item.craftedBy.length > 0) {
        user.logProgression = _.uniq([
          ...user.logProgression,
          +(item.recipeId || item.craftedBy[0].recipeId)
        ]);
      } else if (item.gatheredBy !== undefined) {
        user.gatheringLogProgression = _.uniq([
          ...user.gatheringLogProgression,
          +item.id
        ]);
      }
      this.authFacade.updateUser(user);
    });
  }

  addTag(item: ListRow): void {
    this.authFacade.user$.pipe(
      first()
    ).subscribe(user => {
      if (this.newTag && !user.itemTags.some(entry => entry.id === item.id && entry.tag === this.newTag)) {
        user.itemTags.push({ id: item.id, tag: this.newTag });
      }
      this.authFacade.updateUser(user);
      this.newTag = '';
      this.tagInputVisible = false;
      this.tagInput$.next('');
    });
  }

  removeTag(tag: string, item: ListRow): void {
    this.authFacade.user$.pipe(
      first()
    ).subscribe(user => {
      user.itemTags = user.itemTags.filter(entry => entry.id !== item.id || entry.tag !== tag);
      this.authFacade.updateUser(user);
    });
  }

  checkMasterbooks(books: number[]): void {
    this.authFacade.saveMasterbooks(books.map(book => ({ id: book, checked: true })));
  }

  changeAmount(item: ListRow): void {
    this.modal.create({
      nzTitle: this.translate.instant('Edit_amount'),
      nzFooter: null,
      nzContent: NumberQuestionPopupComponent,
      nzComponentParams: {
        value: item.amount
      }
    }).afterClose
      .pipe(
        filter(res => res !== undefined),
        switchMap((amount) => {
          return this.listsFacade.selectedList$.pipe(
            first(),
            switchMap(list => {
              return this.listManager.addToList(item.id, list, item.recipeId, amount - item.amount);
            })
          );
        })
      )
      .subscribe((list) => {
        this.listsFacade.updateList(list, true);
      });
  }

  removeItem(item: ListRow): void {
    this.listsFacade.selectedList$.pipe(
      first(),
      switchMap(list => {
        return this.listManager.addToList(item.id, list, item.recipeId, -item.amount);
      })
    ).subscribe((list) => {
      this.listsFacade.updateList(list, true);
    });
  }

  removeWorkingOnIt(userId: string, item: ListRow): void {
    item.workingOnIt = (item.workingOnIt || []).filter(u => u !== userId);
    this.saveItem(item);
  }

  openCommentsPopup(list: List, isAuthor: boolean, item: ListRow): void {
    this.modal.create({
      nzTitle: `${this.i18n.getName(this.l12n.getItem(item.id))} - ${this.translate.instant('COMMENTS.Title')}`,
      nzFooter: null,
      nzContent: CommentsPopupComponent,
      nzComponentParams: {
        targetType: CommentTargetType.LIST,
        targetId: list.$key,
        targetDetails: `${this.finalItem ? 'finalItems' : 'items'}:${item.id}`,
        isAuthor: isAuthor,
        notificationFactory: (comment) => {
          return new ListItemCommentNotification(list.$key, item.id, comment.content, list.name, list.authorId);
        }
      }
    }).afterClose.subscribe(() => {
      this.commentBadgeReloader$.next(null);
    });
  }

  setWorkingOnIt(uid: string, item: ListRow): void {
    item.workingOnIt = item.workingOnIt || [];
    item.workingOnIt.push(uid);
    this.saveItem(item);
    this.listsFacade.selectedList$.pipe(
      first(),
      filter(list => list && list.teamId !== undefined),
      withLatestFrom(this.team$)
    ).subscribe(([list, team]) => {
      this.discordWebhookService.notifyUserAssignment(team, uid, item.id, list);
    });
  }

  private saveItem(item: ListRow): void {
    this.listsFacade.updateItem(item, this.finalItem);
  }

  assignTeamMember(team: Team, memberId: string, item: ListRow): void {
    this.setWorkingOnIt(memberId, item);
  }

  itemDoneChanged(newValue: number, item: ListRow): void {
    if (this.settings.displayRemaining) {
      newValue += item.used;
    }
    this.listsFacade.setItemDone(item.id, item.icon, this.finalItem, newValue - item.done, item.recipeId, item.amount);
  }


  add(amount: string | number, item: ListRow, external = false): void {
    // Amount is typed to string because it's from input value, which is always considered as string.
    this.listsFacade.setItemDone(item.id, item.icon, this.finalItem, +amount, item.recipeId, item.amount, external);
  }

  remove(amount: string, item: ListRow, external = false): void {
    // Amount is typed to string because it's from input value, which is always considered as string.
    this.listsFacade.setItemDone(item.id, item.icon, this.finalItem, -1 * (+amount), item.recipeId, item.amount, external);
  }

  markAsDone(item: ListRow): void {
    this.listsFacade.setItemDone(item.id, item.icon, this.finalItem, item.amount - item.done, item.recipeId, item.amount);
  }

  resetDone(item: ListRow): void {
    this.listsFacade.setItemDone(item.id, item.icon, this.finalItem, -1 * item.done, item.recipeId, item.amount);
  }

  toggleAlarm(display: AlarmDisplay): void {
    if (display.registered) {
      this.alarmsFacade.deleteAlarm(display.alarm);
    } else {
      this.alarmsFacade.addAlarms(display.alarm);
    }
  }

  success(key: string, args?: any): void {
    this.messageService.success(this.translate.instant(key, args));
  }

  addToList(item: ListRow): void {
    this.listPicker.pickList().pipe(
      mergeMap(list => {
        const operation = this.listManager.addToList(item.id, list,
          item.recipeId ? item.recipeId : '', item.amount);
        return this.progressService.showProgress(operation,
          1,
          'Adding_recipes',
          { amount: 1, listname: list.name });
      }),
      tap(list => list.$key ? this.listsFacade.updateList(list) : this.listsFacade.addList(list)),
      mergeMap(list => {
        // We want to get the list created before calling it a success, let's be pessimistic !
        return this.progressService.showProgress(
          combineLatest(this.listsFacade.myLists$, this.listsFacade.listsWithWriteAccess$).pipe(
            map(([myLists, listsICanWrite]) => [...myLists, ...listsICanWrite]),
            map(lists => lists.find(l => l.createdAt.toMillis() === list.createdAt.toMillis() && l.$key !== undefined)),
            filter(l => l !== undefined),
            first()
          ), 1, 'Saving_in_database');
      })
    ).subscribe((list) => {
      this.notificationService.success(
        this.translate.instant('Success'),
        this.translate.instant('Recipe_Added', { listname: list.name })
      );
    });
  }


  addAlarmWithGroup(alarm: Alarm, group: AlarmGroup) {
    alarm.groupId = group.$key;
    this.alarmsFacade.addAlarms(alarm);
  }

  private handleAlarms(item: ListRow): void {
    // We don't want to display more than 6 alarms, else it becomes a large shitfest
    if (!item.alarms || item.alarms.length < 8 || this.settings.showAllAlarms) {
      this.alarms = (item.alarms || []).sort((a, b) => {
        if (a.spawns === undefined || b.spawns === undefined) {
          return a.zoneId - b.zoneId;
        }
        if (a.spawns[0] === b.spawns[0]) {
          return a.zoneId - b.zoneId;
        }
        return a.spawns[0] - b.spawns[0];
      });
    } else {
      this.alarms = _.uniqBy(item.alarms, alarm => alarm.zoneId).slice(0, 8);
      this.moreAlarmsAvailable = item.alarms.length - 8;
    }
  }

  addAllAlarms(item: ListRow) {
    this.alarmsFacade.allAlarms$
      .pipe(first())
      .subscribe(allAlarms => {
        const alarmsToAdd = item.alarms.filter(a => {
          return allAlarms.some(alarm => {
            return alarm.itemId === a.itemId && alarm.spawns === a.spawns && alarm.zoneId === a.zoneId;
          });
        });
        this.alarmsFacade.addAlarmsAndGroup(alarmsToAdd, this.i18n.getName(this.l12n.getItem(item.id)));
      });
  }

  public openGatheredByPopup(item: ListRow): void {
    this.openDetailsPopup(GatheredByComponent, item);
  }

  public openHuntingPopup(item: ListRow): void {
    this.openDetailsPopup(HuntingComponent, item);
  }

  public openInstancesPopup(item: ListRow): void {
    this.openDetailsPopup(InstancesComponent, item);
  }

  public openReducedFromPopup(item: ListRow): void {
    this.openDetailsPopup(ReducedFromComponent, item);
  }

  public openDesynthsPopup(item: ListRow): void {
    this.openDetailsPopup(DesynthsComponent, item);
  }

  public openVendorsPopup(item: ListRow): void {
    this.openDetailsPopup(VendorsComponent, item);
  }

  public openVenturesPopup(item: ListRow): void {
    this.openDetailsPopup(VenturesComponent, item);
  }

  public openTreasuresPopup(item: ListRow): void {
    this.openDetailsPopup(TreasuresComponent, item);
  }

  public openFatesPopup(item: ListRow): void {
    this.openDetailsPopup(FatesComponent, item);
  }

  public openVoyagesPopup(item: ListRow): void {
    this.openDetailsPopup(VoyagesComponent, item);
  }

  public openTradesPopup(item: ListRow): void {
    this.openDetailsPopup(TradesComponent, item);
  }

  public openRequirementsPopup(item: ListRow): void {
    this.openDetailsPopup(RelationshipsComponent, item);
  }

  public openSimulator(recipeId: string, item: ListRow): void {
    const entry = item.craftedBy.find(c => c.recipeId === recipeId);
    const craft: Partial<Craft> = {
      id: recipeId,
      job: entry.jobId,
      lvl: entry.level,
      stars: entry.stars_tooltip.length,
      rlvl: entry.rlvl,
      durability: entry.durability,
      progress: entry.progression,
      quality: entry.quality
    };
    this.rotationPicker.openInSimulator(item.id, recipeId, craft);
  }

  private openDetailsPopup(component: Type<ItemDetailsPopup>, item: ListRow): void {
    this.modal.create({
      nzTitle: this.i18n.getName(this.l12n.getItem(item.id), item as CustomItem),
      nzContent: component,
      nzComponentParams: { item: item },
      nzFooter: null
    });
  }

  public isButton(element: ItemRowMenuElement): boolean {
    return this.buttonsCache[element];
  }

  public trackByCraft(index: number, craft: Craft): string {
    return craft.id;
  }

  public trackByAlarm(index: number, alarm: Alarm): string {
    return alarm.$key;
  }

  public trackByInventoryEntry(index: number, entry: { containerName: string, amount: number, hq: boolean }): string {
    return `${entry.containerName}${entry.hq}`;
  }
}
