import * as React from 'react';
import styled from 'styled-components';
import { TripData } from '../models/trip.models';
import moment from 'moment';
import { consts } from '~/common/consts';
import MaterialTable from "material-table";
import { materialTableIcons } from '~/common/materialTableIcons';
import AddIcon from '@material-ui/icons/Add';
import { PrintButton } from '~/common/components/PrintButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import { observer } from 'mobx-react-lite';

export type TripGridProps = {
    tripData: TripData[];
    className?: string;
    onEdit?: (userId: number) => void;
    onDelete?: (userId: number) => void;
    onCreate?: () => void;
}

const _TripGrid = (props: TripGridProps) => {
    const [nextMonthOnly, setNextMonthOnly] = React.useState(false);

    const handleEdit = (tripId: number) => () => {
        if(props.onEdit){
            props.onEdit(tripId);
        }
    }

    const handleDelete = (tripId: number) => () => {
        if(props.onDelete) {
            props.onDelete(tripId);
        }
    }

    const handleCreate = () => {
        if(props.onCreate) {
            props.onCreate();
        }
    }

    const getDaysToDate = (date: Date) => {
        const today = moment().startOf('day');
        const result = moment(date).diff(today, 'days');
        return result < 0 ? '' : result;
    }

    const isNextMonthDate = (date: Date) => {
        const nextMonthDate = moment().startOf('month').add(1, 'month');
        return moment(date).startOf('month').isSame(nextMonthDate);
    }

    const tripsWithDaysLeft = props.tripData.map(trip => {
        return {...trip, daysLeft: getDaysToDate(trip.startDate)};
    }).filter(trip => !nextMonthOnly || isNextMonthDate(trip.startDate));
    const printRef = React.useRef();
    
    return (
        <div className={props.className} ref={printRef}>
            <MaterialTable
                data={tripsWithDaysLeft}
                options={{
                    search: false,
                    filtering: true
                }}
                icons={materialTableIcons}
                title = 'Trips'
                columns={[
                    { 
                        title: "Comment", 
                        field: "comment", 
                        headerStyle: {width: '150px'} 
                    },
                    { 
                        title: "Start date",
                        field: "startDate",
                        render: rowData =>  moment(rowData.startDate).format(consts.dateFormat),
                        type: 'date',
                        headerStyle: {width: '120px'}
                    },
                    { 
                        title: "End date", 
                        field: "endDate",
                        render: rowData =>  moment(rowData.endDate).format(consts.dateFormat),
                        type: 'date',
                        headerStyle: {width: '120px'}
                    },
                    { 
                        title: "Days left",
                        field: 'daysLeft',
                        type: 'numeric',
                        filtering: false,
                        headerStyle: {width: '120px'}
                    },
                    {
                        title: 'Destination',
                        field: 'destination',
                        headerStyle: {width: '150px'}
                    },
                    {
                        title: 'Actions',
                        field: 'actions',
                        headerStyle: {width: '100px', textAlign: 'center'},
                        sorting: false,
                        filtering: false,
                        searchable: false,
                        render: (rowData) => 
                        <div className="actions-wrapper">
                            <IconButton onClick={handleEdit(rowData.id)} className="mr-1"><EditIcon/></IconButton>
                            <IconButton onClick={handleDelete(rowData.id)} className="mr-1"><DeleteIcon/></IconButton>
                        </div>
                    }
                  ]}
                  actions = {[
                    {
                        component: (props: any)=><IconButton onClick={handleCreate} className="ml-1"><AddIcon/></IconButton>,
                        icon: '',
                        isFreeAction: true,
                        onClick: () => {}
                    },
                    {
                        component: () => <PrintButton className="ml-1" printRef={printRef}/>,
                        icon: '',
                        isFreeAction: true,
                        onClick: () => {}
                    },
                    {
                        component: () => <FormControlLabel
                                    className="ml-1 mt-1"
                                    label="Next month only"
                                    control={
                                        <Checkbox 
                                            color="primary"
                                            checked={nextMonthOnly} 
                                            onChange={(event) => setNextMonthOnly(event.target.checked)} 
                                            value="checked" />
                                    }
                                />,
                        icon: '',
                        onClick: () => {},
                        isFreeAction: true
                    },
                  ] as any}
                  
                  components={{
                        Action: props => (
                            <props.action.component/>
                        ),
                    }}
                  >

            </MaterialTable>
        </div>
    );
}

export const TripGrid = styled(observer(_TripGrid))`
    max-width: 1000px;
    width: 100vw;
    margin: 0px auto;

    .actions-wrapper {
        display: flex;
    }

    .MuiTable-root {
        table-layout: fixed;
    }

    .MuiTableCell-head, .MuiTableCell-body {
        padding: 14px 16px;
        text-align: left;
        flex-direction: row;
    }
`;