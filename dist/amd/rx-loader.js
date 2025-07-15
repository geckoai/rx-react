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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "rxjs", "qs", "@geckoai/class-transformer", "react-router-dom", "react", "@geckoai/platform-react"], function (require, exports, rxjs_1, qs_1, class_transformer_1, react_router_dom_1, react_1, platform_react_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RxLoader = void 0;
    qs_1 = __importDefault(qs_1);
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
            var query = qs_1.default.parse(url.search.replace(/^\?/, ''));
            var transformer = container.get(class_transformer_1.ClassTransformer);
            var origin = Object.assign({}, params, query);
            var body = transformer.transform(this.target, origin);
            return [body, origin];
        };
        RxLoader.prototype.useRxLoaderData = function () {
            var _this = this;
            var _a = (0, react_router_dom_1.useLoaderData)(), body = _a[0], origin = _a[1];
            var navigate = (0, react_router_dom_1.useNavigate)();
            var instance = (0, react_1.useRef)(new rxjs_1.BehaviorSubject(body));
            var transformer = (0, platform_react_1.useService)(class_transformer_1.ClassTransformer);
            if (instance.current.value !== body) {
                instance.current.next(body);
            }
            return [instance.current, function (value) {
                    if (typeof value === 'function') {
                        return navigate("?".concat(qs_1.default.stringify(__assign(__assign({}, origin), transformer.transform(_this.target, value(body))), {
                            serializeDate: function (d) { var _a; return String((_a = d === null || d === void 0 ? void 0 : d.getTime()) !== null && _a !== void 0 ? _a : ''); }
                        })));
                    }
                    return navigate("?".concat(qs_1.default.stringify(__assign(__assign({}, origin), transformer.transform(_this.target, value)), {
                        serializeDate: function (d) { var _a; return String((_a = d === null || d === void 0 ? void 0 : d.getTime()) !== null && _a !== void 0 ? _a : ''); }
                    })));
                }];
        };
        RxLoader.Builder = RxLoaderBuilder;
        return RxLoader;
    }());
    exports.RxLoader = RxLoader;
});
