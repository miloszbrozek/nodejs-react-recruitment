import * as React from 'react';
import PrintIcon from '@material-ui/icons/Print';
import IconButton from '@material-ui/core/IconButton';
import ReactToPrint from 'react-to-print';

export type PrintButtonProps = {
    className?: string;
    printRef: React.MutableRefObject<any>;
}

const _PrintButton = (props: PrintButtonProps) => {
    return (
        <>
            <ReactToPrint
                trigger={() => 
                <IconButton className={props.className} edge="start" color="inherit" aria-label="Print">
                    <PrintIcon />
                </IconButton>
                }
                content={() => props.printRef.current}
            />
        </>
    );
}

export const PrintButton = _PrintButton;