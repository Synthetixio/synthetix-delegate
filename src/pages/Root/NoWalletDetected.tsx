import React, { memo, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PageLogo, PageHeadline } from 'styles/common';

export const NoWalletDetected: FC = memo(() => {
	const { t } = useTranslation();

	return (
		<>
			<PageLogo />
			<PageHeadline>{t('no-wallet-detected.headline')}</PageHeadline>
		</>
	);
});

export default NoWalletDetected;
