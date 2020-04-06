import invert from 'lodash/invert';

export type NetworkId = number;
export type NetworkName = string;

export type SupportedNetworkId = 1 | 3 | 4 | 42;
export type SupportedNetworkName = 'MAINNET' | 'ROPSTEN' | 'RINKEBY' | 'KOVAN';

export const SUPPORTED_NETWORKS: Record<SupportedNetworkId, SupportedNetworkName> = {
	1: 'MAINNET',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	42: 'KOVAN',
};

// @ts-ignore
export const SUPPORTED_NETWORKS_MAP: Record<SupportedNetworkName, SupportedNetworkId> = invert(
	SUPPORTED_NETWORKS
);

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;
export const INFURA_JSON_RPC_URLS = {
	[SUPPORTED_NETWORKS_MAP.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
	[SUPPORTED_NETWORKS_MAP.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
	[SUPPORTED_NETWORKS_MAP.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
	[SUPPORTED_NETWORKS_MAP.KOVAN]: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};
