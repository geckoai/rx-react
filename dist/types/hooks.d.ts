import { Observable } from "rxjs";
import { RxModel } from "./rx-model";
import { RxViewModel } from "./rx-view-model";
export declare function useRxModel<T>(initialState: T): RxModel<T>;
export declare function useRxViewModel<T>(init: (() => Observable<T>) | Observable<T>): RxViewModel<T>;
