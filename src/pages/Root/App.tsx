import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { providers } from 'ethers';

import history from 'utils/history';

import { ROUTES } from 'constants/routes';

import ListWallets from 'pages/ListWallets';
import ManageWallet from 'pages/ManageWallet';
import snxJSConnector from 'utils/snxJSConnector';

import { setNetworkSettings, setCurrentWalletAddress } from 'store/ducks/wallet';
import { fetchGasPriceRequest } from 'store/ducks/transaction/gasPrice';
import Spinner from 'components/Spinner';

import 'translations/i18n';
import useInterval from 'hooks/useInterval';
import { REQUEST_REFRESH_INTERVAL_MS } from 'constants/request';

declare const window: any;

interface DispatchProps {
	setNetworkSettings: typeof setNetworkSettings;
	setCurrentWalletAddress: typeof setCurrentWalletAddress;
	fetchGasPriceRequest: typeof fetchGasPriceRequest;
}

type AppProps = DispatchProps;

export const App: FC<AppProps> = ({
	setNetworkSettings,
	setCurrentWalletAddress,
	fetchGasPriceRequest,
}) => {
	const [isAppReady, setAppReady] = useState<boolean>(false);

	useEffect(() => {
		const { ethereum } = window;

		const init = async () => {
			if (ethereum) {
				const web3 = new providers.Web3Provider(ethereum);
				const { chainId: networkId } = await web3.getNetwork();
				const accounts = await ethereum.enable();

				snxJSConnector.setContractSettings({
					networkId,
					signer: web3.getSigner(),
				});

				setNetworkSettings({ networkId });
				setCurrentWalletAddress({ walletAddress: accounts[0] });
				fetchGasPriceRequest();
				setAppReady(true);
			}
		};

		init();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		const { ethereum } = window;

		// TODO: handle these better (reset redux state, etc)
		if (ethereum) {
			const events = ['accountsChanged', 'networkChanged'];
			events.forEach(event => {
				ethereum.on(event, () => {
					window.location.reload();
				});
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAppReady]);

	useInterval(() => {
		fetchGasPriceRequest();
	}, REQUEST_REFRESH_INTERVAL_MS);

	return (
		<Container>
			<Router history={history}>
				{isAppReady ? (
					<>
						<Switch>
							<Route path={ROUTES.ManageWalletMatch} component={ManageWallet} />
							<Route path={ROUTES.ListWallets} component={ListWallets} />
						</Switch>
					</>
				) : (
					<Spinner fullscreen={true} />
				)}
			</Router>
		</Container>
	);
};

const Container = styled.div`
	padding: 27px;
	text-align: center;
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	> * {
		flex-shrink: 0;
		width: 100%;
	}
	max-width: 374px;
`;

const mapDispatchToProps: DispatchProps = {
	setNetworkSettings,
	setCurrentWalletAddress,
	fetchGasPriceRequest,
};

export default connect(null, mapDispatchToProps)(App);
