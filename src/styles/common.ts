import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Z_INDEX } from 'constants/ui';

import { ReactComponent as MintrLogo } from 'assets/images/mintr-logo.svg';

export const FlexDiv = styled.div`
	display: flex;
`;

export const FlexDivCentered = styled(FlexDiv)`
	align-items: center;
`;

export const FlexDivCol = styled(FlexDiv)`
	flex-direction: column;
`;

export const FlexDivRow = styled(FlexDiv)`
	justify-content: space-between;
`;

export const linkCSS = css`
	text-decoration: none;
	&:hover {
		text-decoration: none;
	}
`;

export const ExternalLink = styled.a.attrs({
	target: '_blank',
	rel: 'noopener',
})`
	${linkCSS};
`;

export const Link = styled(NavLink).attrs({
	activeClassName: 'active',
})`
	${linkCSS};
`;

export const absoluteCenteredCSS = css`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

export interface MessageProps {
	size?: string;
	floating?: boolean;
	type?: 'error' | 'success';
}

export const Message = styled(FlexDivCentered)<MessageProps>`
	border-radius: 1px;
	transition: opacity 0.2s ease-out;
	width: 100%;
	
	${props =>
		props.size === 'sm'
			? css`
					font-size: 11px;
					padding: 5px 10px;
			  `
			: css`
					font-size: 13px;
					padding: 11px 10px;
			  `}		

	${props =>
		props.floating &&
		css`
			z-index: ${Z_INDEX.TOOLTIP};
			position: absolute;
		`}

	${props => {
		switch (props.type) {
			case 'error': {
				return css`
					background-color: ${props => props.theme.colors.red};
				`;
			}
			case 'success': {
				return css`
					background-color: ${props => props.theme.colors.green};
				`;
			}
			default:
		}
	}}
`;

export const PageLogo = styled(MintrLogo)<{ size?: 'lg' | 'sm' }>`
	width: 291px;
	height: 80px;
	${props =>
		props.size === 'sm' &&
		css`
			width: 174px;
			height: 48px;
		`}
`;

export const PageHeadline = styled.div<{ size?: 'lg' | 'sm' }>`
	font-family: ${props => props.theme.fonts.regular};
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 20px;
	padding-bottom: 50px;
	padding-top: 16px;

	${props =>
		props.size === 'sm' &&
		css`
			font-size: 16px;
			padding-bottom: 50px;
			padding-top: 11px;
		`}
`;
