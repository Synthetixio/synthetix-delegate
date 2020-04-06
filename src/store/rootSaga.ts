import { all } from 'redux-saga/effects';

import { watchFetchGasPriceRequest } from './ducks/transaction/gasPrice';
import { watchFetchDelegateWalletsRequest } from './ducks/delegates/delegateWallets';
import { watchFetchDelegateWalletInfoRequest } from './ducks/delegates/delegateWalletInfo';

const rootSaga = function*() {
	yield all([
		watchFetchDelegateWalletsRequest(),
		watchFetchGasPriceRequest(),
		watchFetchDelegateWalletInfoRequest(),
	]);
};

export default rootSaga;
