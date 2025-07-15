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

import {BehaviorSubject,} from "rxjs";
import qs from "qs";
import {ClassTransformer} from "@geckoai/class-transformer";
import {LoaderFunctionArgs, useLoaderData, useNavigate} from "react-router-dom";
import {Container, FactoryProvider} from "@geckoai/gecko-core";
import {ClassConstructor} from "@geckoai/class-mirror";
import {HttpClient} from "@geckoai/http";
import {Dispatch, SetStateAction, useRef} from "react";
import {useService} from "@geckoai/platform-react";

class RxLoaderBuilder<T extends object> {
  constructor(private target: ClassConstructor<T>, private provide?: FactoryProvider<HttpClient>) { }

  public setProvide(provide: FactoryProvider<HttpClient>) {
    this.provide = provide;
    return this;
  }

  public build() {
    return new RxLoader<T>(this.target, this.provide);
  }
}


export class RxLoader<T extends object> {
  public static Builder = RxLoaderBuilder;

  constructor(private target: ClassConstructor<T>, private provide?: FactoryProvider<HttpClient>) {
    this.loader = this.loader.bind(this);
    this.useRxLoaderData = this.useRxLoaderData.bind(this);
  }

  public loader({request, params}: LoaderFunctionArgs, container: Container) {
    const url = new URL(request.url);
    const query = qs.parse(url.search.replace(/^\?/, '')) as Partial<T>;
    const transformer = container.get(ClassTransformer);
    const origin = Object.assign({}, params, query);
    const body = transformer.transform(this.target, origin);
    return [body, origin];
  }

  public useRxLoaderData(): [BehaviorSubject<T>, Dispatch<SetStateAction<T>>] {
    const [body, origin] = useLoaderData() as [T, object];
    const navigate = useNavigate();
    const instance = useRef(new BehaviorSubject<T>(body));
    const transformer = useService<ClassTransformer>(ClassTransformer);

    if (instance.current.value !== body) {
      instance.current.next(body);
    }

    return [instance.current, (value) => {
      if (typeof value === 'function') {
        return navigate(`?${qs.stringify({
          ...origin,
          ...transformer.transform(this.target, value(body))
        }, {
          serializeDate: d => String(d?.getTime() ?? '')
        })}`);
      }
      return navigate(`?${qs.stringify({...origin, ...transformer.transform(this.target, value)}, {
        serializeDate: d => String(d?.getTime() ?? '')
      })}`);
    }]
  }
}