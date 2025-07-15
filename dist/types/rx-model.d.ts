import { BehaviorSubject } from "rxjs";
import { Dispatch, SetStateAction } from "react";
export declare class RxModel<T> extends BehaviorSubject<T> {
    private constructor();
    useState(): [T, Dispatch<SetStateAction<T>>];
    static for<T>(initialState: T): RxModel<T>;
}
