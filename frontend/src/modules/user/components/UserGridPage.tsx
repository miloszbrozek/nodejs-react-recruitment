import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { UserServiceCtx } from '~/common/services/UserService';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { consts } from '~/common/consts';
import { UserGrid } from './UserGrid';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type UserPageProps = {
}

const _UserGridPage = (props: UserPageProps & RouteComponentProps<any>) => {
    const userService = React.useContext(UserServiceCtx);
    const authService = React.useContext(AuthServiceCtx);

    const handleUserEdit = (userId: number) => {
        props.history.push(consts.navigation.EditUser.navigate(userId));
    }

    const handleUserDelete = (userId: number) => {
        userService.deleteUser(userId)
            .then(() => userService.fetchUsers());
    }

    const handleUserTrips = (userId: number) => {
        props.history.push(consts.navigation.UserTrips.navigate(userId));
    }

    const handleUserCreate = () => {
        props.history.push(consts.navigation.CreateUser);
    }
    
    React.useEffect(()=> {
        if(!authService.isAuhenticated()){
            props.history.push(consts.navigation.Login);
        } else {
            userService.fetchUsers();
        }
    }, []);

    const currentUserId = authService.getCurrentUserId();

    return <>        
        {userService.users && <SinglePageCard>
            <UserGrid 
                canModifyOthersTrips={userService.canEditOthersTrips()}
                userData={userService.users.filter(user => user.id !== currentUserId)} 
                onDelete={handleUserDelete} 
                onEdit={handleUserEdit} 
                onTrips={handleUserTrips} 
                onCreate={handleUserCreate}/>
        </SinglePageCard>
        }
    </>;
}

export const UserGridPage = withRouter(observer(_UserGridPage));