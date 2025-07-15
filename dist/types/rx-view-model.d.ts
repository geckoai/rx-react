import { Observable, Subscriber } from "rxjs";
export declare class RxViewModel<T> extends Observable<T> {
    constructor(observable: Observable<T> | ((subscriber: Subscriber<T>) => void));
    static for<T>(observable: Observable<T> | ((subscriber: Subscriber<T>) => void)): RxViewModel<T>;
    useValue(): T;
}
