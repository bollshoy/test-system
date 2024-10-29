import {ROLE_FAILURE, ROLE_REQUEST, ROLE_SUCCESS} from "../action/roleAction.js";

const initialState = {
    role: null,
    loading: false,
    error: null,
};

const roleReducer = (state = initialState, action) => {
    switch (action.type) {
        case ROLE_REQUEST:
            return { ...state, loading: true };
        case ROLE_SUCCESS:
            return { ...state, loading: false, role: action.payload, error: null };
        case ROLE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default roleReducer;