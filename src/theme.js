import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        christmas: {
            50: '#f7e7e7',
            100: '#e8c5c5',
            200: '#d89f9f',
            300: '#c97878',
            400: '#bb5151',
            500: '#a13434',
            600: '#7e2929',
            700: '#5b1e1e',
            800: '#391313',
            900: '#1a0808'
        },
        holly: {
            50: '#e8f5e9',
            100: '#c8e6c9',
            200: '#a5d6a7',
            300: '#81c784',
            400: '#66bb6a',
            500: '#4caf50',
            600: '#43a047',
            700: '#388e3c',
            800: '#2e7d32',
            900: '#1b5e20'
        }
    },
    components: {
        Button: {
            variants: {
                christmas: {
                    bg: 'christmas.500',
                    color: 'white',
                    _hover: { bg: 'christmas.600' }
                },
                holly: {
                    bg: 'holly.500',
                    color: 'white',
                    _hover: { bg: 'holly.600' }
                }
            }
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'lg',
                    boxShadow: 'lg'
                }
            },
            variants: {
                message: {
                    container: {
                        bg: 'white',
                        p: 6
                    }
                },
                style: {
                    container: {
                        bg: 'gray.50',
                        p: 4,
                        cursor: 'pointer',
                        _hover: { bg: 'gray.100' }
                    }
                }
            }
        }
    },
    styles: {
        global: {
            body: {
                bg: 'gray.50',
                color: 'gray.800'
            }
        }
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false
    },
    fonts: {
        heading: '"Playfair Display", serif',
        body: '"Open Sans", sans-serif'
    },
    breakpoints: {
        sm: '30em',
        md: '48em',
        lg: '62em',
        xl: '80em'
    }
});

export default theme;
