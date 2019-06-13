import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { consts } from '~/common/consts';
import { TripFormValues, TripForm } from './TripForm';
import { TripServiceCtx } from '../services/TripService';
import classnames from 'classnames';
import { SinglePageCard } from '~/common/components/SingleCardPage';

export type TripCreateEditPageProps = {
    mode: 'edit' | 'create'
}

export type TripCreateEditPageParams = {
    id?: string;
    userId?: string;
}

const _TripCreateEditPage = (props: TripCreateEditPageProps & RouteComponentProps<TripCreateEditPageParams>) => {
    const tripService = React.useContext(TripServiceCtx);
    const authService = React.useContext(AuthServiceCtx);
    const tripId = parseInt(props.match.params.id);
    const userId = tripService.getUserIdFromQueryString(props.location.search);

    const handleEditSubmit = (values: TripFormValues) => {
        tripService.updateTrip(tripId, { ...values, userId: userId})
            .then(() => props.history.push(consts.navigation.UserTrips.navigate(userId)));
    }

    const handleCreateSubmit = (values: TripFormValues) => {
        tripService.createTrip({ ...values, userId: userId})
            .then(() => props.history.push(consts.navigation.UserTrips.navigate(userId)));
    }

    const handleCancel = () => {
        props.history.push(consts.navigation.UserTrips.navigate(userId));
    }

    React.useEffect(()=> {
        if(!authService.isAuhenticated()) {
            props.history.push(consts.navigation.Login);
        } else if(!userId) {
            props.history.push(consts.navigation.Users);
        } else {
            if(props.mode === 'edit') {
                tripService.fetchEditedTrip(tripId);
            }
        }
    }, []);

    
    const showEdit = props.mode === 'edit' && tripService.editedTrip;
    const showCreate = props.mode === 'create';

    return (
        <SinglePageCard className={classnames({'d-none': !showEdit && !showCreate})} title={props.mode === 'create' ? 'Create trip' : 'Edit trip'}>
            {showEdit && <TripForm currentValues={tripService.editedTrip} onSubmit={handleEditSubmit} onCancel={handleCancel} />}
            {showCreate && <TripForm onSubmit={handleCreateSubmit} onCancel={handleCancel} />}
        </SinglePageCard>
    );
}

export const TripCreateEditPage = withRouter(observer(_TripCreateEditPage));
