import * as React from 'react';
import { LoginForm } from './LoginForm';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { consts } from '~/common/consts';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type LoginPageProps = {
    className?: string;
}

const _LoginPage = (props: LoginPageProps & RouteComponentProps<any>) => {    
    const authService = React.useContext(AuthServiceCtx);
    
    const handleLogIn = () => {
        props.history.push(consts.navigation.UserTrips.navigate(authService.getCurrentUserId()));
    }
    return (
        <SinglePageCard title="Sign in">
            <LoginForm onLoggedIn={handleLogIn}/>
        </SinglePageCard>
    );
}

export const LoginPage = withRouter(_LoginPage)