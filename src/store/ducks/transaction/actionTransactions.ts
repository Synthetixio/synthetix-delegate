import { takeEvery, call, put } from 'redux-saga/effects';
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'store/types';
import snxJSConnector from 'utils/snxJSConnector';
import { fetchDelegateWalletInfoRequest } from '../delegates/delegateWalletInfo';

export interface Transaction {
	hash: string;
}
export interface TransactionError {
	errorMessageKey: string;
	// Id might be a hash, but if we failed before getting a hash another id string
	id: string;
}

type ActionTransactionState = {
	byHash: Record<string, Transaction>;
	errorsById: Record<string, TransactionError>;
};
const initialState: ActionTransactionState = {
	byHash: {},
	errorsById: {},
};

const sliceName = 'actionTransactions';

export const actionTransactionsSlice = createSlice({
	name: sliceName,
	initialState,
	reducers: {
		addTransaction: (
			state,
			action: PayloadAction<{
				hash: string;
				walletAddress: string;
			}>
		) => {
			const { hash } = action.payload;
			state.byHash[hash] = { hash };
		},
		removeTransaction: (
			state,
			action: PayloadAction<{
				hash: string;
			}>
		) => {
			const { hash } = action.payload;
			delete state.byHash[hash];
		},
		addError: (state, action: PayloadAction<TransactionError>) => {
			const { id, errorMessageKey } = action.payload;
			state.errorsById[id] = { errorMessageKey, id };
		},
		removeError: (
			state,
			action: PayloadAction<{
				id: string;
			}>
		) => {
			const { id } = action.payload;
			delete state.errorsById[id];
		},
	},
});

export const {
	addTransaction,
	removeTransaction,
	addError,
	removeError,
} = actionTransactionsSlice.actions;

const getActionTransactionState = (state: RootState) => state.transaction[sliceName];

export const getTransactions = createSelector(getActionTransactionState, transactionState =>
	Object.values(transactionState.byHash)
);

export const getErrors = createSelector(getActionTransactionState, transactionState =>
	Object.values(transactionState.errorsById)
);

function* addTransactionSaga(action: PayloadAction<{ hash: string; walletAddress: string }>) {
	const { hash, walletAddress } = action.payload;
	const status = yield call(snxJSConnector.utils.waitForTransaction, hash);
	if (status === 'error') {
		yield put(addError({ id: hash, errorMessageKey: 'common.errors.unknown-error-try-again' }));
	} else {
		yield put(removeError({ id: hash }));
		yield put(fetchDelegateWalletInfoRequest({ walletAddresses: [walletAddress] }));
	}
	yield put(removeTransaction({ hash }));
}

export function* watchAddTransaction() {
	yield takeEvery(addTransaction.type, addTransactionSaga);
}

export default actionTransactionsSlice.reducer;
