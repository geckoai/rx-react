/**
 * MIT License
 *
 * Copyright (c) 2021 @geckoai/rx-react RanYunLong<549510622@qq.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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