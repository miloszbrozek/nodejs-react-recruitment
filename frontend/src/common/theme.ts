import { createMuiTheme } from '@material-ui/core/styles';

// palette colors: https://coolors.co/a9c717-2e2e2e-040403-5b7553-8eb897
export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#788E72',
            main: '#5B7553',
            dark: '#4B6044',
            contrastText: '#FFFFFF',
        },
        secondary: {
            light: '#c8db6b',
            main: '#b8d141',
            dark: '#A9C717',
            contrastText: '#040403',
        }
    },
});

export const hexColorToRgb = (hex: string) => {
    return {
        r: parseInt(hex.substring(1,3), 16),
        g: parseInt(hex.substring(3,5), 16),
        b: parseInt(hex.substring(5,7), 16)
    };
}