import { UPDATE } from "./types";


const INITIAL_STATE = {
	data: {},
	duration: 600,
	info: null
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
