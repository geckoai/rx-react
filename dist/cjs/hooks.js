"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRxViewModel = exports.useRxModel = void 0;
var react_1 = require("react");
var rx_model_1 = require("./rx-model");
var rx_view_model_1 = require("./rx-view-model");
function useRxModel(initialState) {
    return (0, react_1.useRef)(rx_model_1.RxModel.for(initialState)).current;
}
exports.useRxModel = useRxModel;
function useRxViewModel(init) {
    var ref = (0, react_1.useRef)(null);
    if (!ref.current) {
        ref.current = rx_view_model_1.RxViewModel.for(init);
    }
    return ref.current;
}
exports.useRxViewModel = useRxViewModel;
