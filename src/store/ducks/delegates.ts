import { takeLatest, put, select } from 'redux-saga/effects';
import uniq from 'lodash/uniq';

import { RootState } from 'store/types';
import { getAddress } from 'ethers/utils';
import snxJS from 'utils/snxJSConnector';

import { WalletAddress } from 'constants/wallet';

import { getCurrentWalletAddress } from './wallet';
import { createRequestSliceFactory, RequestSliceFactoryState } from './utils/requestSliceFactory';

const delegatesSliceName = 'delegates';

export type DelegatesSliceState = RequestSliceFactoryState<WalletAddress[]>;

const delegatesSlice = createRequestSliceFactory<WalletAddress[]>({
	name: delegatesSliceName,
	initialState: {
		data: [],
	},
});

export const getDelegatesState = (state: RootState) => state[delegatesSliceName];

export const {
	fetchRequest: fetchDelegateWalletsRequest,
	fetchSuccess: fetchDelegateWalletsSuccess,
	fetchFailure: fetchDelegateWalletsFailure,
} = delegatesSlice.actions;

interface DelegateApprovalEventLog {
	values: {
		delegate: string;
		authoriser: string;
	};
}

type DelegateApprovalEvents = DelegateApprovalEventLog[];

function* fetchDelegateWallets() {
	const currentWalletAddress = yield select(getCurrentWalletAddress);

	if (!currentWalletAddress) {
		yield put(fetchDelegateWalletsFailure({ error: 'you need to be connected to a wallet' }));
	} else {
		try {
			const {
				// @ts-ignore
				snxJS: { DelegateApprovals, contractSettings },
			} = snxJS;

			const filter = {
				fromBlock: 0,
				toBlock: 9e9,
				...DelegateApprovals.contract.filters.Approval(),
			};

			const events: DelegateApprovalEvents = yield contractSettings.provider.getLogs(filter);

			// Note: Using getAddress() here because parseLog and web3 don't have the same format
			const delegateWallets = events
				.map(log => DelegateApprovals.contract.interface.parseLog(log))
				.filter(
					({ values: { delegate } }) => getAddress(delegate) === getAddress(currentWalletAddress)
				)
				.map(({ values: { authoriser } }) => authoriser);

			yield put(fetchDelegateWalletsSuccess({ data: uniq(delegateWallets) }));
		} catch (e) {
			yield put(fetchDelegateWalletsFailure({ error: e.message }));
		}
	}
}

export function* watchFetchDelegateWalletsRequest() {
	yield takeLatest(fetchDelegateWalletsRequest.type, fetchDelegateWallets);
}

export default delegatesSlice.reducer;
