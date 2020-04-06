import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/types';

import { DEFAULT_GAS_LIMIT } from 'constants/transaction';

export interface GasInfoState {
	gasLimit: number;
}

const initialState: GasInfoState = {
	gasLimit: DEFAULT_GAS_LIMIT,
};

const gasInfoSliceName = 'gasInfo';

export const gasInfoSlice = createSlice({
	name: gasInfoSliceName,
	initialState,
	reducers: {
		setGasLimit: (
			state,
			action: PayloadAction<{
				gasLimit: number;
			}>
		) => {
			const { gasLimit } = action.payload;

			state.gasLimit = gasLimit;
		},
	},
});

export const { setGasLimit } = gasInfoSlice.actions;

export const getGasInfoState = (state: RootState) => state.transaction[gasInfoSliceName];
export const getGasLimit = (state: RootState) => getGasInfoState(state).gasLimit;

export default gasInfoSlice.reducer;
