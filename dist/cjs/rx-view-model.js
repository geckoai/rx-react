"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RxViewModel = void 0;
var rxjs_1 = require("rxjs");
var react_1 = require("react");
var RxViewModel = (function (_super) {
    __extends(RxViewModel, _super);
    function RxViewModel(observable) {
        var _this = _super.call(this, function (subscriber) {
            if (observable instanceof rxjs_1.Observable) {
                observable.subscribe(subscriber);
            }
            else {
                observable(subscriber);
            }
        }) || this;
        _this.useValue = _this.useValue.bind(_this);
        return _this;
    }
    RxViewModel.for = function (observable) {
        return new RxViewModel(observable);
    };
    RxViewModel.prototype.useValue = function () {
        var _this = this;
        var _a = (0, react_1.useState)(null), state = _a[0], setState = _a[1];
        (0, react_1.useEffect)(function () {
            var subscribe = _this.subscribe(setState);
            return function () { return subscribe.unsubscribe(); };
        }, [setState]);
        return state;
    };
    return RxViewModel;
}(rxjs_1.Observable));
exports.RxViewModel = RxViewModel;
