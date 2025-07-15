import {Observable, Subscriber} from "rxjs";
import {useEffect, useState} from "react";


export class RxViewModel<T> extends Observable<T> {
  constructor(observable: Observable<T> | ((subscriber: Subscriber<T>) => void)) {
    super((subscriber) => {
      if (observable instanceof Observable) {
        observable.subscribe(subscriber);
      } else {
        observable(subscriber);
      }
    })
    this.useValue = this.useValue.bind(this);
  }

  public static for<T>(observable: Observable<T> | ((subscriber: Subscriber<T>) => void)) {
    return new RxViewModel(observable);
  }


  public useValue() {
    const [state, setState] = useState<T | null>(null)
    useEffect(() => {
      const subscribe = this.subscribe(setState);
      return () => subscribe.unsubscribe();
    }, [setState])
    return state;
  }
}