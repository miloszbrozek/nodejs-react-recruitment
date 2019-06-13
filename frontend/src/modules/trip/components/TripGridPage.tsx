import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { consts } from '~/common/consts';
// import { UserGrid } from './UserGrid';
import { TripService, TripServiceCtx } from '../services/TripService';
import { TripGrid } from './TripGrid';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type TripGridPageParams = {
    id?: string;
}

const _TripGridPage = (props: {} & RouteComponentProps<TripGridPageParams>) => {
    const authService = React.useContext(AuthServiceCtx);
    const tripService = React.useContext(TripServiceCtx);
    const userId = tripService.getUserIdFromQueryString(props.location.search);

    const handleTripEdit = (tripId: number) => {
        props.history.push(consts.navigation.EditUserTrip.navigate(tripId, userId));
    }

    const handleTripDelete = (tripId: number) => {
        tripService.deleteTrip(tripId)
            .then(() => tripService.fetchTrips(userId));
    }

    const handleTripCreate = () => {
        props.history.push(consts.navigation.CreateUserTrip.navigate(userId));
    }
    
    React.useEffect(()=> {
        if(!authService.isAuhenticated()) {
            props.history.push(consts.navigation.Login);
        } else if(!userId) {
            props.history.push(consts.navigation.Users);
        } else {
            tripService.fetchTrips(userId);
        }
    }, [userId]);

    return <>
        <SinglePageCard>
            <TripGrid tripData={tripService.trips} onDelete={handleTripDelete} onEdit={handleTripEdit} onCreate={handleTripCreate}/>
        </SinglePageCard>
    </>;
}

export const TripGridPage = withRouter(observer(_TripGridPage));