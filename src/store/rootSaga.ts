import { all } from 'redux-saga/effects';

import { watchFetchDelegateWalletsRequest } from './ducks/delegates';
import { watchFetchGasPriceRequest } from './ducks/transaction/gasPrice';

const rootSaga = function*() {
	yield all([watchFetchDelegateWalletsRequest(), watchFetchGasPriceRequest()]);
};

export default rootSaga;
