import BigNumber from 'bignumber.js';

export type NumericValue = BigNumber | string | number;

export const toBigNumber = (value: NumericValue) => new BigNumber(value);
