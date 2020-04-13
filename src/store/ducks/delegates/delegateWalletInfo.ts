import { takeLatest, put, all, call } from 'redux-saga/effects';

import { RootState } from 'store/types';
import { BigNumberish, formatEther } from 'ethers/utils';

import { WalletAddress, WalletAddresses } from 'constants/wallet';

import { createRequestSliceFactory, RequestSliceFactoryState } from '../utils/requestSliceFactory';
import snxJSConnector from 'utils/snxJSConnector';
import { toBigNumber } from 'utils/math';
import { PayloadAction, ActionCreatorWithPayload } from '@reduxjs/toolkit';

const delegateWalletInfoSliceName = 'delegateWalletInfo';

export interface DelegateWalletInfo {
	collatRatio: number | null;
	targetRatio: number | null;
	maxIssuableSynths: number | null;
	isFeesClaimable: boolean;
	sUSDBalance: number | null;
	hasFeesToClaim: boolean;
}

export type DelegateWalletsInfo = Record<WalletAddress, DelegateWalletInfo>;

export type DelegatesSliceState = RequestSliceFactoryState<DelegateWalletsInfo>;

const delegatesWalletsDataSlice = createRequestSliceFactory<DelegateWalletsInfo>({
	name: delegateWalletInfoSliceName,
	initialState: {
		data: {},
	},
	options: {
		mergeData: true,
	},
});

export const getDelegateWalletInfoState = (state: RootState) =>
	state.delegates[delegateWalletInfoSliceName];

export const {
	fetchRequest,
	fetchSuccess: fetchDelegateWalletInfoSuccess,
	fetchFailure: fetchDelegateWalletInfoFailure,
} = delegatesWalletsDataSlice.actions;

// TODO: find a better way to type this
// @ts-ignore
export const fetchDelegateWalletInfoRequest: ActionCreatorWithPayload<{
	walletAddresses: WalletAddresses;
}> = fetchRequest;

function* fetchDelegateWalletInfo(walletAddr: WalletAddress) {
	const {
		snxJS: { Synthetix, SynthetixState, FeePool, sUSD },
	} = snxJSConnector;
	type DelegateWalletData = {
		collateralisationRatio: BigNumberish;
		issuanceRatio: BigNumberish;
		maxIssueSynths: BigNumberish;
		isFeesClaimable: boolean;
		feesAvailable: [BigNumberish, BigNumberish];
		sUSDBalance: number;
	};

	const delegateData: DelegateWalletData = yield all({
		collateralisationRatio: call(Synthetix.collateralisationRatio, walletAddr),
		issuanceRatio: call(SynthetixState.issuanceRatio),
		maxIssueSynths: call(Synthetix.maxIssuableSynths, walletAddr),
		isFeesClaimable: call(FeePool.isFeesClaimable, walletAddr),
		feesAvailable: call(FeePool.feesAvailable, walletAddr),
		sUSDBalance: call(sUSD.balanceOf, walletAddr),
	});

	const {
		collateralisationRatio,
		issuanceRatio,
		maxIssueSynths,
		isFeesClaimable,
		feesAvailable,
		sUSDBalance,
	} = delegateData;

	const [sUSDExchangeFees, SNXRewards] = feesAvailable.map(formatEther);

	const data = {
		[walletAddr]: {
			collatRatio:
				collateralisationRatio > 0
					? Math.round(
							toBigNumber(100)
								.dividedBy(formatEther(collateralisationRatio))
								.toNumber()
					  )
					: 0,
			targetRatio:
				issuanceRatio > 0
					? Math.round(
							toBigNumber(100)
								.dividedBy(formatEther(issuanceRatio))
								.toNumber()
					  )
					: 0,
			maxIssuableSynths: Number(formatEther(maxIssueSynths)),
			isFeesClaimable,
			hasFeesToClaim: Boolean(Number(sUSDExchangeFees) !== 0 || Number(SNXRewards) !== 0),
			sUSDBalance: Number(sUSDBalance),
		},
	};

	yield put(fetchDelegateWalletInfoSuccess({ data }));
}

function* fetchDelegateWalletsInfo(action: PayloadAction<{ walletAddresses: WalletAddresses }>) {
	try {
		const { walletAddresses } = action.payload;

		yield all(walletAddresses.map(walletAddr => fetchDelegateWalletInfo(walletAddr)));
	} catch (e) {
		yield put(fetchDelegateWalletInfoFailure({ error: e.message }));
	}
}

export function* watchFetchDelegateWalletInfoRequest() {
	yield takeLatest(fetchDelegateWalletInfoRequest.type, fetchDelegateWalletsInfo);
}

export default delegatesWalletsDataSlice.reducer;
