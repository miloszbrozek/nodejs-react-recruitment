import * as React from 'react';
import { ErrorData } from '../models/error.models';
import Box from '@material-ui/core/Box';

export type ErrorOutletProps = {
    error: ErrorData|string;
    className?: string;
}

export const ErrorOutlet = (props: ErrorOutletProps) => {
    const coalescedError = props.error || '';
    const message = typeof coalescedError === 'string' ? coalescedError : coalescedError.message;
    
    return (
        <>
            {message && <Box className={props.className} component="span" color="error.main">
                {message}
            </Box>}
        </>
    );
}