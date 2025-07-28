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

import {DependencyList, useEffect, useRef} from "react";
import {Observable} from "rxjs";
import {RxModel} from "./rx-model";
import {RxViewModel} from "./rx-view-model";

export function useRxModel<T>(initialState: T, deps?: DependencyList) {
  const ref = useRef<RxModel<T>>(RxModel.for(initialState));
  useEffect(() => {
    ref.current.next(initialState);
  }, deps ?? []);
  return ref.current;
}

export function useRxViewModel<T>(init: (() => Observable<T>) | Observable<T>): RxViewModel<T> {
  const ref = useRef<RxViewModel<T> | null>(null);
  if (!ref.current) {
    ref.current = RxViewModel.for<T>(init)
  }
  return ref.current;
}