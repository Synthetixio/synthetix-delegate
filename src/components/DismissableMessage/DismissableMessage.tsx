import React, { memo, FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

import { MessageProps, Message } from 'styles/common';

interface DismissableMessageProps extends MessageProps {
	children: React.ReactNode;
	onDismiss: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export const DismissableMessage: FC<DismissableMessageProps> = memo(
	({ children, onDismiss, ...rest }) => (
		<Container>
			<StyledMessage {...rest}>
				{children}
				<StyledCloseButton onClick={onDismiss} />
			</StyledMessage>
		</Container>
	)
);

const Container = styled.div`
	position: relative;
`;

const StyledMessage = styled(Message)`
	justify-content: space-between;
`;

const StyledCloseButton = styled(CloseIcon)`
	cursor: pointer;
`;

export default DismissableMessage;
