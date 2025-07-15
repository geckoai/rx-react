var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { BehaviorSubject, } from "rxjs";
import qs from "qs";
import { ClassTransformer } from "@geckoai/class-transformer";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useService } from "@geckoai/platform-react";
var RxLoaderBuilder = (function () {
    function RxLoaderBuilder(target, provide) {
        this.target = target;
        this.provide = provide;
    }
    RxLoaderBuilder.prototype.setProvide = function (provide) {
        this.provide = provide;
        return this;
    };
    RxLoaderBuilder.prototype.build = function () {
        return new RxLoader(this.target, this.provide);
    };
    return RxLoaderBuilder;
}());
var RxLoader = (function () {
    function RxLoader(target, provide) {
        this.target = target;
        this.provide = provide;
        this.loader = this.loader.bind(this);
        this.useRxLoaderData = this.useRxLoaderData.bind(this);
    }
    RxLoader.prototype.loader = function (_a, container) {
        var request = _a.request, params = _a.params;
        var url = new URL(request.url);
        var query = qs.parse(url.search.replace(/^\?/, ''));
        var transformer = container.get(ClassTransformer);
        var origin = Object.assign({}, params, query);
        var body = transformer.transform(this.target, origin);
        return [body, origin];
    };
    RxLoader.prototype.useRxLoaderData = function () {
        var _this = this;
        var _a = useLoaderData(), body = _a[0], origin = _a[1];
        var navigate = useNavigate();
        var instance = useRef(new BehaviorSubject(body));
        var transformer = useService(ClassTransformer);
        if (instance.current.value !== body) {
            instance.current.next(body);
        }
        return [instance.current, function (value) {
                if (typeof value === 'function') {
                    return navigate("?".concat(qs.stringify(__assign(__assign({}, origin), transformer.transform(_this.target, value(body))), {
                        serializeDate: function (d) { var _a; return String((_a = d === null || d === void 0 ? void 0 : d.getTime()) !== null && _a !== void 0 ? _a : ''); }
                    })));
                }
                return navigate("?".concat(qs.stringify(__assign(__assign({}, origin), transformer.transform(_this.target, value)), {
                    serializeDate: function (d) { var _a; return String((_a = d === null || d === void 0 ? void 0 : d.getTime()) !== null && _a !== void 0 ? _a : ''); }
                })));
            }];
    };
    RxLoader.Builder = RxLoaderBuilder;
    return RxLoader;
}());
export { RxLoader };
