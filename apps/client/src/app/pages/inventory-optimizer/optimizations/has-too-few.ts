import { InventoryOptimizer } from './inventory-optimizer';
import { InventoryItem } from '../../../model/user/inventory/inventory-item';
import { UserInventory } from '../../../model/user/inventory/user-inventory';
import { ListRow } from '../../../modules/list/model/list-row';
import { stackSizes } from '../../../core/data/sources/stack-sizes';
import { Injectable } from "@angular/core";

@Injectable()
export class HasTooFew extends InventoryOptimizer {

  static THRESHOLD_KEY = 'optimizer:has-few:threshold';

  _getOptimization(item: InventoryItem, inventory: UserInventory, data: ListRow): { [p: string]: number | string } {
    const threshold = +(localStorage.getItem(HasTooFew.THRESHOLD_KEY) || 3);
    if (stackSizes[item.itemId] > 1 && item.quantity <= threshold) {
      return { amount: item.quantity };
    }
    return null;
  }

  getId(): string {
    return 'HAS_TOO_FEW';
  }
}
