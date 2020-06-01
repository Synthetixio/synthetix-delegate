import React, { memo, useEffect, FC } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { match } from 'react-router-dom';

import { ReactComponent as BackButton } from 'assets/images/back-button.svg';

import Link from 'components/Link';
import Button from 'components/Button';
import DismissableMessage from 'components/DismissableMessage';
import Spinner from 'components/Spinner';

import ROUTES from 'constants/routes';

import snxJSConnector from 'utils/snxJSConnector';

import { toShortWalletAddr } from 'utils/formatters/wallet';
import { normalizeGasLimit, gweiGasPrice, transactionHashToLink } from 'utils/transaction';
import { RootState } from 'store/types';
import { getGasPrice, GasPrice } from 'store/ducks/transaction/gasPrice';
import {
	Transaction,
	TransactionError,
	addTransaction,
	addError,
	removeError,
	getTransactions,
	getErrors,
} from 'store/ducks/transaction/actionTransactions';
import { getNetworkName } from 'store/ducks/wallet';
import { WalletAddress } from 'constants/wallet';
import { EMPTY_VALUE } from 'constants/placeholder';
import {
	getDelegateWalletInfoState,
	DelegateWalletInfo,
	fetchDelegateWalletInfoRequest,
} from 'store/ducks/delegates/delegateWalletInfo';
import useInterval from 'hooks/useInterval';
import { REQUEST_REFRESH_INTERVAL_MS } from 'constants/request';
import { SupportedNetworkName } from 'constants/network';
import { PageLogo, PageHeadline } from 'styles/common';

interface StateProps {
	gasPrice: GasPrice;
	walletInfo: DelegateWalletInfo;
	isLoading: boolean;
	walletAddr: WalletAddress;
	transactions: Transaction[];
	errors: TransactionError[];
	networkName: SupportedNetworkName;
}

interface DispatchProps {
	fetchDelegateWalletInfoRequest: typeof fetchDelegateWalletInfoRequest;
	addTransaction: typeof addTransaction;
	addError: typeof addError;
	removeError: typeof removeError;
}

interface Props {
	match: match<{ walletAddr: WalletAddress }>;
}

type ManageWalletProps = StateProps & DispatchProps & Props;

const ManageWallet: FC<ManageWalletProps> = memo(
	({
		gasPrice,
		walletInfo,
		walletAddr,
		isLoading,
		fetchDelegateWalletInfoRequest,
		addTransaction,
		transactions,
		networkName,
		addError,
		errors,
		removeError,
	}) => {
		const { t } = useTranslation();
		const {
			collatRatio,
			targetRatio,
			isFeesClaimable,
			hasFeesToClaim,
			maxIssuableSynths,
			sUSDBalance,
		} = walletInfo;

		const {
			snxJS: { FeePool, Synthetix },
		} = snxJSConnector;

		useEffect(() => {
			const init = async () => {
				fetchDelegateWalletInfoRequest({
					walletAddresses: [walletAddr],
				});
			};
			init();
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		useInterval(() => {
			fetchDelegateWalletInfoRequest({ walletAddresses: [walletAddr] });
		}, REQUEST_REFRESH_INTERVAL_MS);

		const handleBurnToTarget = async () => {
			try {
				const gasEstimate = await Synthetix.contract.estimate.burnSynthsToTargetOnBehalf(
					walletAddr
				);

				const { hash } = await Synthetix.burnSynthsToTargetOnBehalf(walletAddr, {
					gasPrice: gweiGasPrice(gasPrice.fast),
					gasLimit: normalizeGasLimit(gasEstimate),
				});
				addTransaction({ hash, walletAddress: walletAddr });
			} catch (e) {
				addError({ id: 'burn', errorMessageKey: 'common.errors.unknown-error-try-again' });
			}
		};

		const handleClaimFees = async () => {
			try {
				const gasEstimate = await FeePool.contract.estimate.claimOnBehalf(walletAddr);

				const { hash } = await FeePool.claimOnBehalf(walletAddr, {
					gasPrice: gweiGasPrice(gasPrice.fast),
					gasLimit: normalizeGasLimit(gasEstimate),
				});
				addTransaction({ hash, walletAddress: walletAddr });
			} catch (e) {
				addError({ id: 'claim', errorMessageKey: 'common.errors.unknown-error-try-again' });
			}
		};

		const handleMintMax = async () => {
			try {
				const gasEstimate = await Synthetix.contract.estimate.issueMaxSynthsOnBehalf(walletAddr);

				const { hash } = await Synthetix.issueMaxSynthsOnBehalf(walletAddr, {
					gasPrice: gweiGasPrice(gasPrice.fast),
					gasLimit: normalizeGasLimit(gasEstimate),
				});
				addTransaction({ hash, walletAddress: walletAddr });
			} catch (e) {
				addError({ id: 'mint', errorMessageKey: 'common.errors.unknown-error-try-again' });
			}
		};

		const isBurnToTargetButtonDisabled =
			isLoading || (collatRatio != null && targetRatio != null && collatRatio > targetRatio);

		return (
			<>
				<StyledLink to={ROUTES.ListWallets}>
					<BackButton />
				</StyledLink>
				<PageLogo size="sm" />
				<PageHeadline size="sm">{t('manage-wallet.headline')}</PageHeadline>
				<Wallet>{toShortWalletAddr(walletAddr)}</Wallet>
				{transactions.map(transaction => (
					<CollatBox key={transaction.hash}>
						<CollatBoxLabel>
							<TransactionHeadingWrapper>
								{t('manage-wallet.transaction')}
								<TransactionSpinner />
							</TransactionHeadingWrapper>
						</CollatBoxLabel>

						<TransactionLink
							isExternal={true}
							to={transactionHashToLink(transaction.hash, networkName)}
						>
							{transactionHashToLink(transaction.hash, networkName)}
						</TransactionLink>
					</CollatBox>
				))}
				<CollatBox>
					<CollatBoxLabel>{t('manage-wallet.current-c-ratio')}</CollatBoxLabel>
					<CollatBoxValue>{collatRatio != null ? `${collatRatio}%` : EMPTY_VALUE}</CollatBoxValue>
				</CollatBox>
				<CollatBox>
					<CollatBoxLabel>{t('manage-wallet.target-c-ratio')}</CollatBoxLabel>
					<CollatBoxValue>{targetRatio != null ? `${targetRatio}%` : EMPTY_VALUE}</CollatBoxValue>
				</CollatBox>
				<Buttons>
					{sUSDBalance != null && (
						<Button
							size="lg"
							palette="primary"
							disabled={isBurnToTargetButtonDisabled}
							onClick={handleBurnToTarget}
						>
							{t('manage-wallet.buttons.burn-to-target')}
						</Button>
					)}
					<Button
						size="lg"
						palette="primary"
						disabled={isFeesClaimable === false || hasFeesToClaim === false || isLoading}
						onClick={handleClaimFees}
					>
						{t('manage-wallet.buttons.claim-fees')}
					</Button>
					<Button
						size="lg"
						palette="primary"
						disabled={maxIssuableSynths === 0 || isLoading}
						onClick={handleMintMax}
					>
						{t('manage-wallet.buttons.mint-max')}
					</Button>
				</Buttons>
				{errors.length > 0 && (
					<TxErrorMessage
						onDismiss={() => removeError({ id: errors[0].id })}
						type="error"
						size="sm"
						floating={true}
					>
						{t(errors[0].errorMessageKey)}
					</TxErrorMessage>
				)}
			</>
		);
	}
);

const StyledLink = styled(Link)`
	&& {
		width: auto;
		margin-right: auto;
	}
`;

const TxErrorMessage = styled(DismissableMessage)`
	margin: 12px 0;
	text-align: left;
	padding: 10px;
	font-size: 12px;
	color: ${props => props.theme.colors.fontPrimary};
`;

const TransactionHeadingWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;
const TransactionSpinner = styled(Spinner)`
	margin-left: 10px;
`;
const TransactionLink = styled(Link)`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const CollatBox = styled.div`
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	background-color: ${props => props.theme.colors.surfaceL1};
	border: 1px solid ${props => props.theme.colors.accentL2};
	height: 88px;
	box-sizing: border-box;
	margin-bottom: 24px;
	padding: 15px;
`;

const CollatBoxLabel = styled.span`
	font-weight: 500;
	font-size: 14px;
	line-height: 17px;
	letter-spacing: 0.2px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontSecondary};
	text-transform: uppercase;
`;

const CollatBoxValue = styled.span`
	font-weight: 500;
	font-size: 32px;
	letter-spacing: 0.2px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
`;

const Wallet = styled.div`
	font-weight: 500;
	font-size: 20px;
	letter-spacing: 0.2px;
	margin-bottom: 24px;
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	background-color: ${props => props.theme.colors.accentL1};
	display: flex;
	align-items: center;
	justify-content: center;
	height: 48px;
	box-sizing: border-box;
`;

const Buttons = styled.div`
	margin-top: 24px;
	display: grid;
	grid-gap: 24px;
`;

const mapStateToProps = (state: RootState, { match }: Props): StateProps => {
	const {
		params: { walletAddr },
	} = match;

	const walletInfoState = getDelegateWalletInfoState(state);

	return {
		gasPrice: getGasPrice(state),
		transactions: getTransactions(state),
		errors: getErrors(state),
		networkName: getNetworkName(state),
		walletInfo: walletInfoState.data[walletAddr]
			? walletInfoState.data[walletAddr]
			: {
					collatRatio: null,
					targetRatio: null,
					isFeesClaimable: false,
					hasFeesToClaim: false,
					maxIssuableSynths: null,
					sUSDBalance: null,
			  },
		isLoading: walletInfoState.isLoading,
		walletAddr,
	};
};

const mapDispatchToProps: DispatchProps = {
	fetchDelegateWalletInfoRequest,
	addTransaction,
	addError,
	removeError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageWallet);
