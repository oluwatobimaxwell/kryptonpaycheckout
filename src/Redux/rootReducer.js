import { combineReducers } from "redux";
import { reducer as dataReducer } from "./Data/reducer";

const rootReducer = combineReducers({
    data: dataReducer
});

export default rootReducer;
