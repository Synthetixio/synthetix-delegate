import React, { memo, FC } from 'react';
import styled, { keyframes } from 'styled-components';

import spinner from 'assets/images/spinner.png';

import { absoluteCenteredCSS } from 'styles/common';

interface SpinnerProps {
	className?: string;
	fullscreen?: boolean;
}

const Spinner: FC<SpinnerProps> = memo(({ className, fullscreen = false }) => (
	<Container className={className} fullscreen={fullscreen}>
		<Img src={spinner} alt="spinner" />
	</Container>
));

const Container = styled.div<{ fullscreen: boolean }>`
	${props => props.fullscreen && absoluteCenteredCSS}
`;

const imageRotation = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`;

const Img = styled.img`
	animation: ${imageRotation} 2s infinite linear;
	width: 20px;
	height: 20px;
`;

export default Spinner;
