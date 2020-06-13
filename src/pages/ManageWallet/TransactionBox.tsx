import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Transaction } from 'store/ducks/transaction/actionTransactions';
import { transactionHashToLink } from 'utils/transaction';
import { SupportedNetworkName } from 'constants/network';

import Spinner from 'components/Spinner';
import Link from 'components/Link';

import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

type Props = {
	transaction: Transaction;
	networkName: SupportedNetworkName;
	onCloseClick: (transaction: Transaction) => void;
};
const TransactionBox: React.FC<Props> = ({ transaction, networkName, onCloseClick }) => {
	const { t } = useTranslation();
	const link = transactionHashToLink(transaction.hash, networkName);
	return (
		<TransactionContainer
			onClick={() => {
				window.open(link, '_blank');
			}}
		>
			<TransactionStatus>
				{transaction.state === 'complete' && (
					<TransactionCloseButton
						onClick={(e) => {
							e.stopPropagation();
							onCloseClick(transaction);
						}}
					>
						<TransactionCloseCircle>
							<CloseIcon />
						</TransactionCloseCircle>
					</TransactionCloseButton>
				)}
				<TransactionStatusText>
					{t(`manage-wallet.transaction-abbreviation`)} {t(`manage-wallet.${transaction.state}`)}:{' '}
					{t(`manage-wallet.${transaction.type}`)}
				</TransactionStatusText>
				{transaction.state === 'pending' && <TransactionSpinner />}
			</TransactionStatus>
			<ViewTransactionLink isExternal={true} to={link}>
				<span>{t('manage-wallet.view')}</span>
			</ViewTransactionLink>
		</TransactionContainer>
	);
};

const TransactionSpinner = styled(Spinner)`
	margin-left: 10px;
`;

const TransactionContainer = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL1};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	font-family: ${(props) => props.theme.fonts.medium};
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
`;
const TransactionCloseButton = styled.button`
	border: none;
	background: none;
	align-self: stretch;
	cursor: pointer;
	width: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
`;
const TransactionCloseCircle = styled.span`
	background: ${(props) => props.theme.colors.accentL2};
	border-radius: 50%;
	width: 20px;
	height: 20px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const TransactionStatus = styled.div`
	display: flex;
	align-items: center;
	text-transform: uppercase;
`;
const TransactionStatusText = styled.span`
	padding-left: 8px;
	margin-top: 18px;
	margin-bottom: 18px;
`;

const ViewTransactionLink = styled(Link)`
	color: ${(props) => props.theme.colors.buttonDefault};
	text-transform: uppercase;
	padding-right: 10px;
`;

export default TransactionBox;
