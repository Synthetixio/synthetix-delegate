import { WalletAddress } from './wallet';

export const ROUTES = {
	ListWallets: '/',
	ManageWallet: '/manage',
	ManageWalletMatch: '/manage/:walletAddr',
};

export const buildManageWalletLink = (address: WalletAddress) =>
	`${ROUTES.ManageWallet}/${address}`;

export default ROUTES;
