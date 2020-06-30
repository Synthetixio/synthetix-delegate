import { all } from 'redux-saga/effects';

import { watchFetchGasPriceRequest } from './ducks/transaction/gasPrice';
import { watchFetchDelegateWalletsRequest } from './ducks/delegates/delegateWallets';
import { watchFetchDelegateWalletInfoRequest } from './ducks/delegates/delegateWalletInfo';
import { watchAddTransaction } from './ducks/transaction/actionTransactions';

const rootSaga = function*() {
	yield all([
		watchFetchDelegateWalletsRequest(),
		watchFetchGasPriceRequest(),
		watchFetchDelegateWalletInfoRequest(),
		watchAddTransaction(),
	]);
};

export default rootSaga;
