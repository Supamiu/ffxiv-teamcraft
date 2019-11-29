import { ListRow } from '../../../modules/list/model/list-row';
import { Input, Directive } from '@angular/core';

@Directive()
export class ItemDetailsPopup {
  @Input()
  public item: ListRow;
}
