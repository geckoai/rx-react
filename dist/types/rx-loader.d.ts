import { BehaviorSubject } from "rxjs";
import { LoaderFunctionArgs } from "react-router-dom";
import { Container, FactoryProvider } from "@geckoai/gecko-core";
import { ClassConstructor } from "@geckoai/class-mirror";
import { HttpClient } from "@geckoai/http";
import { Dispatch, SetStateAction } from "react";
declare class RxLoaderBuilder<T extends object> {
    private target;
    private provide?;
    constructor(target: ClassConstructor<T>, provide?: FactoryProvider<HttpClient>);
    setProvide(provide: FactoryProvider<HttpClient>): this;
    build(): RxLoader<T>;
}
export declare class RxLoader<T extends object> {
    private target;
    private provide?;
    static Builder: typeof RxLoaderBuilder;
    constructor(target: ClassConstructor<T>, provide?: FactoryProvider<HttpClient>);
    loader({ request, params }: LoaderFunctionArgs, container: Container): (T | (import("react-router/dist/development/register-COAKzST_").o<string> & Partial<T>))[];
    useRxLoaderData(): [BehaviorSubject<T>, Dispatch<SetStateAction<T>>];
}
export {};
