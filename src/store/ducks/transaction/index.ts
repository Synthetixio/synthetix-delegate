import { combineReducers } from '@reduxjs/toolkit';

import gasInfo from './gasInfo';
import gasPrice from './gasPrice';

export default combineReducers({
	gasInfo,
	gasPrice,
});
