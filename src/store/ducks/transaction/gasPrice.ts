import { takeLatest, put } from 'redux-saga/effects';
import { RootState } from 'store/types';

import {
	createRequestSliceFactory,
	RequestSliceFactoryState,
} from 'store/ducks/utils/requestSliceFactory';

export interface GasPrice {
	fast: number;
	average: number;
	slow: number;
}

export type GasPriceSliceState = RequestSliceFactoryState<GasPrice>;

const gasPriceSliceName = 'gasPrice';

const gasPriceSlice = createRequestSliceFactory<GasPrice>({
	name: gasPriceSliceName,
	initialState: {
		data: {
			fast: 0,
			average: 0,
			slow: 0,
		},
	},
});

export const {
	fetchFailure: fetchGasPriceFailure,
	fetchSuccess: fetchGasPriceSuccess,
	fetchRequest: fetchGasPriceRequest,
} = gasPriceSlice.actions;

export const getGasPriceState = (state: RootState) => state.transaction[gasPriceSliceName];
export const getGasPrice = (state: RootState) => getGasPriceState(state).data;

export default gasPriceSlice.reducer;

interface EthGasStationApiResponse {
	fast: number;
	fastest: number;
	safeLow: number;
	average: number;
	block_time: number;
	blockNum: number;
	speed: number;
	safeLowWait: number;
	avgWait: number;
	fastWait: number;
	fastestWait: number;
	gasPriceRange: Record<string, number>;
}

const ETH_GAS_API_URL = 'https://ethgasstation.info/json/ethgasAPI.json';

function* fetchGasPrice() {
	try {
		const results = yield fetch(ETH_GAS_API_URL);
		const networkInfo = (yield results.json()) as EthGasStationApiResponse;

		const fast = networkInfo.fast / 10;
		const average = networkInfo.average / 10;
		const slow = networkInfo.safeLow / 10;

		yield put(
			fetchGasPriceSuccess({
				data: {
					fast,
					average,
					slow,
				},
			})
		);
	} catch (e) {
		yield put(fetchGasPriceFailure({ error: e.message }));
	}
}

export function* watchFetchGasPriceRequest() {
	yield takeLatest(fetchGasPriceRequest.type, fetchGasPrice);
}
