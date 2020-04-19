import * as React from 'react';
import Button from '@material-ui/core/Button';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { consts } from '~/common/consts';

export type LogoutButtonProps = {
    className?: string;
}

const _LogoutButton = (props: LogoutButtonProps & RouteComponentProps<any>) => {
    const authService = React.useContext(AuthServiceCtx);
    const handleClick = () => {
        authService.logout()
            .then(() => props.history.push(consts.navigation.Login));
    }
    return (
        <Button className = {props.className} variant="contained" onClick={handleClick}>Logout</Button>
    );
}

export const LogoutButton = withRouter(_LogoutButton);