import { retrieveFromStorage } from "../../utils/Functions";
import { UPDATE } from "./types";



const params = Object.fromEntries(new URLSearchParams(window.location.search));
let INITIAL_STORED_VALUE = retrieveFromStorage(UPDATE);

if (INITIAL_STORED_VALUE) {
	INITIAL_STORED_VALUE =  { ...INITIAL_STORED_VALUE, ...params, duration: 600 }
}

const INITIAL_STATE = INITIAL_STORED_VALUE || {
	data: params,
	duration: 600,
	info: null,
	nonIntegrated: false
};

export const reducer = (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case UPDATE:
			return {
				...state,
				...action,
			};

		default:
			return state;
	}
};
