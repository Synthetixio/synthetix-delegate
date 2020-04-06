import { SynthetixJs } from 'synthetix-js';
import { JsonRpcProvider, JsonRpcSigner } from 'ethers/providers';
import { ethers } from 'ethers';
import { SupportedNetworkId } from 'constants/network';

interface ContractSettings {
	provider?: JsonRpcProvider;
	signer?: JsonRpcSigner;
	networkId?: number;
}

interface Synth {
	name: string;
	asset: string;
	category: string;
	sign: string;
	desc: string;
	aggregator: string;
}

type Synths = Synth[];

class snxJSConnector {
	snxJS: any;

	constructor() {
		this.snxJS = new SynthetixJs();
	}

	setContractSettings(contractSettings: ContractSettings) {
		this.snxJS = new SynthetixJs(contractSettings);
	}

	get synths(): Synths {
		return this.snxJS.contractSettings.synths;
	}

	get signer(): JsonRpcSigner {
		return this.snxJS.contractSettings.signer;
	}

	get provider(): JsonRpcProvider {
		return this.snxJS.contractSettings.provider;
	}

	get utils() {
		return this.snxJS.utils;
	}

	get ethers(): typeof ethers {
		return this.snxJS.ethers;
	}

	get networkId(): SupportedNetworkId {
		return this.snxJS.contractSettings.networkId;
	}
}

export default new snxJSConnector();
