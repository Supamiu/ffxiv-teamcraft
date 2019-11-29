import { Observable } from 'rxjs';
import { ofPacketSubType } from '../rxjs/of-packet-subtype';
import { buffer, debounceTime, map, tap } from 'rxjs/operators';
import { DataReporter } from './data-reporter';
import { Injectable } from "@angular/core";

@Injectable()
export class DesynthResultReporter implements DataReporter {

  getDataReports(packets$: Observable<any>): Observable<any[]> {
    const desynthResult$ = packets$.pipe(
      ofPacketSubType('desynthOrReductionResult')
    );

    return desynthResult$.pipe(
      buffer(desynthResult$.pipe(debounceTime(1000))),
      map(packets => {
        const sourceItemPacket = packets.find(p => p.resultType === 4321);
        if (sourceItemPacket === undefined) {
          return [];
        }
        const resultItems = packets.filter(p => p.resultType === 4322);
        return resultItems
          .map(resultItemPacket => {
            return {
              itemId: sourceItemPacket.itemID,
              resultItemId: resultItemPacket.itemID,
              itemHQ: sourceItemPacket.itemHQ,
              resultItemHQ: resultItemPacket.itemHQ
            };
          });
      })
    );
  }

  getDataType(): string {
    return 'desynthresults';
  }
}
