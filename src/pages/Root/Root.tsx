import React, { FC } from 'react';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';

// ensure snxJSConnector is initialized
import 'utils/snxJSConnector';

import { darkTheme } from 'styles/theme';

import store from 'store';

import App from './App';

export const Root: FC = () => (
	<ThemeProvider theme={darkTheme}>
		<GlobalStyle />
		<Provider store={store}>
			<App />
		</Provider>
	</ThemeProvider>
);

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.colors.surfaceL1};
    color: ${props => props.theme.colors.fontPrimary};
  }
`;

export default Root;
