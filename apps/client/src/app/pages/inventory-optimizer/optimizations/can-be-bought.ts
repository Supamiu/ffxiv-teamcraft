import { InventoryOptimizer } from './inventory-optimizer';
import { InventoryItem } from '../../../model/user/inventory/inventory-item';
import { UserInventory } from '../../../model/user/inventory/user-inventory';
import { ListRow } from '../../../modules/list/model/list-row';
import { beastTribeNpcs } from '../../../core/data/sources/beast-tribe-npcs';
import { Injectable } from "@angular/core";

@Injectable()
export class CanBeBought extends InventoryOptimizer {

  _getOptimization(item: InventoryItem, inventory: UserInventory, data: ListRow): { [p: string]: number | string } | null {
    if (!item.hq && data && data.vendors && data.vendors.length > 0 && data.vendors.some(v => !beastTribeNpcs.includes(v.npcId))) {
      return {};
    }
    return null;
  }

  getId(): string {
    return 'CAN_BE_BOUGHT';
  }
}
