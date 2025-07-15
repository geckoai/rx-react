import {BehaviorSubject} from "rxjs";
import {Dispatch, SetStateAction, useEffect, useState} from "react";

export class RxModel<T> extends BehaviorSubject<T> {

  private constructor(initialState: T) {
    super(initialState);
    this.useState = this.useState.bind(this);
  }

  public useState(): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState(this.value);
    useEffect(() => {
      const subscribe = this.subscribe(setState);
      return () => subscribe.unsubscribe();
    }, [setState])
    return [state, (callback) => {
      if (typeof callback === 'function') {
        this.next((callback as any)(this.value));
      } else {
        this.next(callback);
      }
    }]
  }

  public static for<T>(initialState: T): RxModel<T> {
    return new RxModel<T>(initialState);
  }
}