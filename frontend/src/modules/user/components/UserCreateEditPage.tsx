import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { UserServiceCtx } from '~/common/services/UserService';
import { UserForm, UserFormValues } from './UserForm';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { consts } from '~/common/consts';
import classnames from 'classnames';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type UserCreateEditPageProps = {
    mode: 'edit' | 'create'
}

export type UserCreateEditPageParams = {
    id?: string;
}

const _UserCreateEditPage = (props: UserCreateEditPageProps & RouteComponentProps<UserCreateEditPageParams>) => {
    const userService = React.useContext(UserServiceCtx);
    const authService = React.useContext(AuthServiceCtx);
    const userId = parseInt(props.match.params.id);

    const handleEditSubmit = (values: UserFormValues) => {
        return userService.updateUser(userId, values)
            .then(() => props.history.push(consts.navigation.Users));
    }

    const handleCreateSubmit = (values: UserFormValues) => {
        return userService.createUser(values)
            .then(() => props.history.push(consts.navigation.Users));
    }

    const handleCancel = () => {
        props.history.push(consts.navigation.Users);
    }

    React.useEffect(()=> {
        if(authService.isAuhenticated()) {
            if(props.mode === 'edit') {
                userService.fetchEditedUser(userId);
            }
        } else {
            props.history.push(consts.navigation.Login);
        }
    }, []);

    
    const showEdit = props.mode === 'edit' && userService.editedUser;
    const showCreate = props.mode === 'create';
    const editTitle = userId === authService.getCurrentUserId() ? 'Edit my profile' : 'Edit user';

    return (
        <SinglePageCard className={classnames({'d-none': !showEdit && !showCreate})} title={props.mode === 'create' ? 'Create user' : editTitle}>
            {showEdit && <UserForm allowToChangeType={userService.canEditOwnUserType()} currentValues={userService.editedUser} onSubmit={handleEditSubmit} onCancel={handleCancel} />}
            {showCreate && <UserForm allowToChangeType={true} onSubmit={handleCreateSubmit} onCancel={handleCancel} />}
        </SinglePageCard>
    );
}

export const UserCreateEditPage = withRouter(observer(_UserCreateEditPage));
