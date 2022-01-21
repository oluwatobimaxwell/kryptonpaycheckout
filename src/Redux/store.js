import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import thunk from 'redux-thunk';


const composedEnhancer = window.location.hostname === "localhostx" ? compose(applyMiddleware(thunk), composeWithDevTools()) : applyMiddleware(thunk)
const store = createStore(rootReducer, composedEnhancer);
export default store;
