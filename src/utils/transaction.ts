import { toBigNumber } from './math';

import { GWEI_UNIT, GAS_LIMIT_BUFFER } from 'constants/transaction';

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
