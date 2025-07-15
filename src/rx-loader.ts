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