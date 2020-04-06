import { WalletAddress } from 'constants/wallet';

export const toShortWalletAddr = (address: WalletAddress, first: number = 5, last: number = 5) =>
	address ? `${address.slice(0, first)}...${address.slice(-last, address.length)}` : null;
