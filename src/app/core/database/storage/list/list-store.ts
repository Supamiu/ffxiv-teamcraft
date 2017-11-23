import {DataStore} from '../data-store';
import {List} from '../../../../model/list/list';
import {Observable} from 'rxjs/Observable';

export abstract class ListStore extends DataStore<List> {

    public abstract byAuthor(uid: string): Observable<List[]>;

    public abstract deleteByAuthor(uid: string): Observable<void | void[]>;
}
