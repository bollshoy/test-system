import { combineReducers } from "redux";
import authReducer from "./authReducer.js";
import registerReducer from "./registerReducer.js";
import profileReducer from "./profileReducer.js";
import resetPassword from "./resetPassword.js";

const rootReducer = combineReducers({
	auth: authReducer,
	register: registerReducer,
	profile: profileReducer,
	resetPassword: resetPassword,
});

export default rootReducer;
