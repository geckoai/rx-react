import { useEffect, useRef } from "react";
import { RxModel } from "./rx-model";
import { RxViewModel } from "./rx-view-model";
export function useRxModel(initialState, deps) {
    var ref = useRef(RxModel.for(initialState));
    useEffect(function () {
        ref.current.next(initialState);
    }, deps !== null && deps !== void 0 ? deps : []);
    return ref.current;
}
export function useRxViewModel(init) {
    var ref = useRef(null);
    if (!ref.current) {
        ref.current = RxViewModel.for(init);
    }
    return ref.current;
}
