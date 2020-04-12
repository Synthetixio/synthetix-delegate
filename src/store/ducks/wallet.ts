import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store/types';
import { SUPPORTED_NETWORKS, SupportedNetworkId, NetworkId } from 'constants/network';
import { WalletAddress } from 'constants/wallet';

import snxJSConnector from 'utils/snxJSConnector';

export interface WalletSliceState {
	currentWalletAddress: WalletAddress | null;
	networkId: SupportedNetworkId;
}

const initialState: WalletSliceState = {
	currentWalletAddress: null,
	networkId: snxJSConnector.networkId,
};

const walletSliceName = 'wallet';

export const walletSlice = createSlice({
	name: walletSliceName,
	initialState,
	reducers: {
		setCurrentWalletAddress: (
			state,
			action: PayloadAction<{
				walletAddress: WalletAddress;
			}>
		) => {
			const { walletAddress } = action.payload;

			state.currentWalletAddress = walletAddress;
		},
		setNetworkSettings: (
			state,
			action: PayloadAction<{
				networkId: NetworkId;
			}>
		) => {
			const { networkId } = action.payload;

			state.networkId = networkId as SupportedNetworkId;
		},
	},
});

export const { setCurrentWalletAddress, setNetworkSettings } = walletSlice.actions;

export const getWalletState = (state: RootState) => state[walletSliceName];
export const getNetworkId = (state: RootState) => getWalletState(state).networkId;
export const getNetworkName = (state: RootState) => SUPPORTED_NETWORKS[getNetworkId(state)];
export const getCurrentWalletAddress = (state: RootState) =>
	getWalletState(state).currentWalletAddress;
export const getIsLoggedIn = (state: RootState) => !!getCurrentWalletAddress(state);

export default walletSlice.reducer;
