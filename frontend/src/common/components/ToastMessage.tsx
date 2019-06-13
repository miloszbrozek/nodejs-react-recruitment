import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';

export type ToastMessageProps = {
    className?: string;
    open: boolean;
    message: string;
    onClose?: (event) => void;
}

export const ToastMessage = (props: ToastMessageProps) => {

    const handleClose = (event) => {
        if(props.onClose) {
            props.onClose(event);
        }
    }

    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            open={props.open}
            autoHideDuration={6000}
            onClose={handleClose}
            ContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{props.message}</span>}
            action={[
            <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon />
            </IconButton>,
            ]}
        />
    )
}