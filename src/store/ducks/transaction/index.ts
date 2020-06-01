import { combineReducers } from '@reduxjs/toolkit';

import gasInfo from './gasInfo';
import gasPrice from './gasPrice';
import actionTransactions from './actionTransactions';

export default combineReducers({
	gasInfo,
	gasPrice,
	actionTransactions,
});
