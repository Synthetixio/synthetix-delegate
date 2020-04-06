import { combineReducers } from '@reduxjs/toolkit';

import wallet from './ducks/wallet';
import delegates from './ducks/delegates';
import transaction from './ducks/transaction';

const rootReducer = combineReducers({
	wallet,
	delegates,
	transaction,
});

export default rootReducer;
