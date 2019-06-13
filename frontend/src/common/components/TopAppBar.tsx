import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import styled from 'styled-components';
import classnames from 'classnames';
import { LogoutButton } from './LogoutButton';
import { MenuButton } from './MenuButton';

export type TopAppBarProps = {
  className?: string;
}

const _TopAppBar = (props: TopAppBarProps) => {

  return (
    <div className={classnames('bar', props.className)}>
      <AppBar position="static">
        <Toolbar>
          <MenuButton/>
          <div className="filler" />
          <LogoutButton className="logout"/>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export const TopAppBar = styled(_TopAppBar)`
  &.bar {
    position: absolute;
    width: 100vw;
    flex-grow: 1;
    .filler {
      flex-grow: 1;
    }
    .logout {

    }
  }
`;