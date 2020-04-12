import { combineReducers } from '@reduxjs/toolkit';

import delegateWallets from './delegateWallets';
import delegateWalletInfo from './delegateWalletInfo';

export default combineReducers({
	delegateWallets,
	delegateWalletInfo,
});
