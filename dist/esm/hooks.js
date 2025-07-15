import { useRef } from "react";
import { RxModel } from "./rx-model";
import { RxViewModel } from "./rx-view-model";
export function useRxModel(initialState) {
    return useRef(RxModel.for(initialState)).current;
}
export function useRxViewModel(init) {
    var ref = useRef(null);
    if (!ref.current) {
        ref.current = RxViewModel.for(init);
    }
    return ref.current;
}
