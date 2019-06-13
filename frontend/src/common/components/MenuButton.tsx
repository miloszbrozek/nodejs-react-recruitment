import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { consts } from '~/common/consts';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { UserServiceCtx } from '~/common/services/UserService';

type ItemType = 'myTrips' | 'users' | 'myProfile'

const _MenuButton = (props: RouteComponentProps<any>) => {
    const authService = React.useContext(AuthServiceCtx);
    const userService = React.useContext(UserServiceCtx);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const closeMenu = () => {
        setAnchorEl(null);
    }

    const handleMenuItem = (itemType: ItemType) => () => {
        closeMenu();
        switch(itemType) {
            case 'myTrips':
                props.history.push(consts.navigation.UserTrips.navigate(authService.getCurrentUserId()));
                break;
            case 'myProfile':
                props.history.push(consts.navigation.EditUser.navigate(authService.getCurrentUserId()));
                break;
            case 'users':
                props.history.push(consts.navigation.Users);
                break;
        }
    }
    
    return (
        <div>
            <IconButton edge="start" color="inherit" aria-label="Menu" onClick={handleClick}>
                <MenuIcon />
            </IconButton>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem onClick={handleMenuItem('myTrips')}>My trips</MenuItem>
                <MenuItem onClick={handleMenuItem('myProfile')}>My profile</MenuItem>
                {
                    userService.canEditOtherUsers() &&
                    <MenuItem onClick={handleMenuItem('users')}>Users</MenuItem>
                }
                
            </Menu>
        </div>
    );
}

export const MenuButton = withRouter(_MenuButton);