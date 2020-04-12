import { css } from 'styled-components';

const headingCSS = css`
	font-family: ${props => props.theme.fonts.regular};
`;

export const headingH5CSS = css`
	font-family: ${props => props.theme.fonts.medium};
	font-size: 20px;
	line-height: 25px;
	letter-spacing: 0.2px;
`;

export const headingLargeCSS = css`
	${headingCSS};
	font-family: ${props => props.theme.fonts.bold};
	font-size: 56px;
	line-height: 56px;
	letter-spacing: 0.2px;
`;

export const headingMediumCSS = css`
	${headingCSS};
	line-height: 32px;
	font-size: 32px;
	letter-spacing: 0.2px;
`;

export const headingSmallCSS = css`
	${headingCSS};
	line-height: 14px;
	font-size: 14px;
	letter-spacing: 0.5px;
`;
