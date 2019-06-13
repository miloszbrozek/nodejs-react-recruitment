import * as React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import classnames from 'classnames';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { TopAppBar } from './TopAppBar';
import { PrintButton } from './PrintButton';

export type SinglePageCardProps = {
    className?: string;
    title?: string;
    children: React.ReactNode;
}

const CardTitle = (props: {title: string}) => {
    return (
        <div className="text-center p-2">
            <h3>{props.title}</h3>
        </div>
    )
};

const _SinglePageCard = (props: SinglePageCardProps) => {
    const authService = React.useContext(AuthServiceCtx);
    const printRef = React.useRef();
    return (
        <>
            {authService.isAuhenticated() && <TopAppBar/>}
            <Container className={classnames('single-card-page', props.className)} ref={printRef}>
                <Paper >
                    {props.title && <CardTitle title={props.title} />}
                    {props.children}
                </Paper>
            </Container>
        </>
    );
}

export const SinglePageCard = styled(_SinglePageCard)`
    &.single-card-page {
        padding: 20vh 0px 0px;
        display:flex;
        align-items: center;
        height: 100vh;
        flex-direction: column;
    }
`