import {useRef} from "react";
import {Observable} from "rxjs";
import {RxModel} from "./rx-model";
import {RxViewModel} from "./rx-view-model";

export function useRxModel<T>(initialState: T) {
  return useRef<RxModel<T>>(RxModel.for(initialState)).current
}

export function useRxViewModel<T>(init: (() => Observable<T>) | Observable<T>): RxViewModel<T> {
  const ref = useRef<RxViewModel<T> | null>(null);
  if (!ref.current) {
    ref.current = RxViewModel.for<T>(init)
  }
  return ref.current;
}