import * as React from 'react';
import { UserForm, UserFormValues } from '~/modules/user/components/UserForm';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { consts } from '~/common/consts';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type RegisterPageProps = {

}

const _RegisterPage = (props: RegisterPageProps & RouteComponentProps<any>) => {
    const authService = React.useContext(AuthServiceCtx);
    const handleSubmit = (values: UserFormValues) => {
        authService.register(values)
            .then(() => props.history.push(consts.navigation.Login));
    }
    const handleCancel = () => {
        props.history.push(consts.navigation.Login);
    }

    return (
        <SinglePageCard title="Register">
            <UserForm allowToChangeType={false} onSubmit={handleSubmit} onCancel={handleCancel}/>
        </SinglePageCard>
    );
}

export const RegisterPage = withRouter(_RegisterPage);