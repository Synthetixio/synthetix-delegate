import { toBigNumber } from './math';

import { GWEI_UNIT, GAS_LIMIT_BUFFER } from 'constants/transaction';
import { SupportedNetworkName } from 'constants/network';

export const calcTxPrice = (gasPrice: number, gasLimit: number, ethPrice: number) =>
	toBigNumber(gasPrice)
		.multipliedBy(ethPrice)
		.multipliedBy(gasLimit)
		.dividedBy(GWEI_UNIT)
		.toNumber();

export const normalizeGasLimit = (gasLimit: number) =>
	toBigNumber(gasLimit)
		.plus(GAS_LIMIT_BUFFER)
		.toNumber();

export const gweiGasPrice = (gasPrice: number) =>
	toBigNumber(gasPrice)
		.multipliedBy(GWEI_UNIT)
		.toNumber();

export const transactionHashToLink = (hash: string, networkName: SupportedNetworkName) => {
	const subDomain = networkName === 'MAINNET' ? '' : networkName.toLowerCase() + '.';
	return `https://${subDomain}etherscan.io/tx/${hash}`;
};
