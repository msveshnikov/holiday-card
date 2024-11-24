import { createRoot } from 'react-dom/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import theme from './theme';
import App from './App';
import './i18n';
import { I18nextProvider } from 'react-i18next';

const root = createRoot(document.getElementById('root'));

root.render(
    <HelmetProvider>
        <Helmet>
            <title>AI Christmas Card Message Generator</title>
            <meta name="description" content="Generate personalized AI-powered holiday messages" />
            <meta property="og:title" content="AI Christmas Card Message Generator" />
            <meta property="og:description" content="Create unique holiday messages with AI" />
            <meta property="og:type" content="website" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Helmet>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <ChakraProvider theme={theme}>
            <I18nextProvider>
                <App />
            </I18nextProvider>
        </ChakraProvider>
    </HelmetProvider>
);
