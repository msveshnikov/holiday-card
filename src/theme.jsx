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
        },
        snow: {
            50: '#ffffff',
            100: '#f5f5f5',
            200: '#eeeeee',
            300: '#e0e0e0',
            400: '#bdbdbd',
            500: '#9e9e9e',
            600: '#757575',
            700: '#616161',
            800: '#424242',
            900: '#212121'
        }
    },
    components: {
        Button: {
            variants: {
                christmas: {
                    bg: 'christmas.500',
                    color: 'white',
                    _hover: { bg: 'christmas.600' },
                    transition: 'all 0.3s ease'
                },
                holly: {
                    bg: 'holly.500',
                    color: 'white',
                    _hover: { bg: 'holly.600' },
                    transition: 'all 0.3s ease'
                },
                snow: {
                    bg: 'snow.100',
                    color: 'gray.800',
                    _hover: { bg: 'snow.200' },
                    transition: 'all 0.3s ease'
                }
            }
        },
        Card: {
            baseStyle: {
                container: {
                    borderRadius: 'lg',
                    boxShadow: 'lg',
                    transition: 'all 0.3s ease'
                }
            },
            variants: {
                message: {
                    container: {
                        bg: 'white',
                        p: 6,
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'all 0.3s ease'
                    }
                },
                style: {
                    container: {
                        bg: 'gray.50',
                        p: 4,
                        cursor: 'pointer',
                        _hover: {
                            bg: 'gray.100',
                            transform: 'translateY(-2px)'
                        },
                        transition: 'all 0.3s ease'
                    }
                },
                preview: {
                    container: {
                        bg: 'snow.50',
                        p: 8,
                        textAlign: 'center',
                        opacity: 1,
                        transform: 'scale(1)',
                        transition: 'all 0.3s ease'
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
        body: '"Open Sans", sans-serif',
        festive: '"Great Vibes", cursive',
        modern: '"Montserrat", sans-serif'
    },
    breakpoints: {
        sm: '30em',
        md: '48em',
        lg: '62em',
        xl: '80em',
        '2xl': '96em'
    },
    shadows: {
        outline: '0 0 0 3px rgba(161, 52, 52, 0.6)'
    },
    sizes: {
        container: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px'
        }
    }
});

export default theme;
