import * as React from 'react';
import 'reflect-metadata';
import { BrowserRouter as Router, Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom';
import { UserGridPage } from '~/modules/user/components/UserGridPage';
import { LoginPage } from '~/modules/auth/components/LoginPage';
import { consts } from '~/common/consts';
import { UserCreateEditPage } from '~/modules/user/components/UserCreateEditPage';
import { TripCreateEditPage } from '~/modules/trip/components/TripCreateEditPage';
import { TripGridPage } from '~/modules/trip/components/TripGridPage';
import { RegisterPage } from '~/modules/auth/components/RegisterPage';

export const App = () => {
  return (
    <>
      <Router>
        <Switch>
          {/* <Route exact path={'/'} render={() => <UserView/>} /> */}
          <Route path={consts.navigation.Users} render={() => <UserGridPage/>} />
          <Route path={consts.navigation.UserTrips.route} render={() => <TripGridPage/>} />
          <Route path={consts.navigation.Register} render={() => <RegisterPage />} />
          <Route path={consts.navigation.Login} render={() => <LoginPage />} />
          <Route path={consts.navigation.EditUser.route} render={() => <UserCreateEditPage mode={'edit'}/>}/>
          <Route path={consts.navigation.CreateUser} render={() => <UserCreateEditPage mode={'create'}/>} />
          <Route path={consts.navigation.EditUserTrip.route} render={() => <TripCreateEditPage mode={'edit'}/>}/>
          <Route path={consts.navigation.CreateUserTrip.route} render={() => <TripCreateEditPage mode={'create'}/>} />
          <Redirect from='*' to={consts.navigation.Login} />

        </Switch>
      </Router>
    </>
  );
}