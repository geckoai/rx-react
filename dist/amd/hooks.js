define(["require", "exports", "react", "./rx-model", "./rx-view-model"], function (require, exports, react_1, rx_model_1, rx_view_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useRxViewModel = exports.useRxModel = void 0;
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
});
