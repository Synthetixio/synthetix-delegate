import { takeEvery, call, put } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

export const gasInfoSlice = createSlice({
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

export const { addTransaction, removeTransaction, addError, removeError } = gasInfoSlice.actions;

export const getActionTransactionState = (state: RootState) => state.transaction[sliceName];
export const getTransactions = (state: RootState) =>
	Object.values(getActionTransactionState(state).byHash);

export const getErrors = (state: RootState) =>
	Object.values(getActionTransactionState(state).errorsById);

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

export default gasInfoSlice.reducer;
