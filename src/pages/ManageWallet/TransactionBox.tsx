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

	return (
		<TransactionContainer>
			{transaction.state === 'complete' && (
				<TransactionClose onClick={() => onCloseClick(transaction)} />
			)}
			<TransactionStatus>
				<span>
					{t(`manage-wallet.transaction-abbreviation`)} {t(`manage-wallet.${transaction.state}`)}:{' '}
					{t(`manage-wallet.${transaction.type}`)}
				</span>
				{transaction.state === 'pending' && <TransactionSpinner />}
			</TransactionStatus>
			<ViewTransactionLink
				isExternal={true}
				to={transactionHashToLink(transaction.hash, networkName)}
			>
				{t('manage-wallet.view')}
			</ViewTransactionLink>
		</TransactionContainer>
	);
};
export default TransactionBox;

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
	padding: 18px 15px;
`;
const TransactionClose = styled(CloseIcon)`
	position: absolute;
	top: 5px;
	right: 5px;
	cursor: pointer;
`;
const TransactionStatus = styled.div`
	display: flex;
	align-items: center;
`;

const ViewTransactionLink = styled(Link)`
	color: ${(props) => props.theme.colors.buttonDefault};
`;
