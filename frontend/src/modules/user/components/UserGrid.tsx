import * as React from 'react';
import styled from 'styled-components';
import { GetUserData } from '~/common/models/user.models';
import Button from '@material-ui/core/Button';
import MaterialTable from "material-table";
import { materialTableIcons } from '~/common/materialTableIcons';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

export type UserGridProps = {
    userData: GetUserData[];
    className?: string;
    canModifyOthersTrips: boolean;
    onTrips?: (userId: number) => void;
    onEdit?: (userId: number) => void;
    onDelete?: (userId: number) => void;
    onCreate?: () => void;
}

const _UserGrid = (props: UserGridProps) => {

    const handleEdit = (userId: number) => () => {
        if(props.onEdit){
            props.onEdit(userId);
        }
    }

    const handleDelete = (userId: number) => () => {
        if(props.onDelete) {
            props.onDelete(userId);
        }
    }

    const handleTrips = (userId: number) => () => {
        if(props.onTrips) {
            props.onTrips(userId);
        }
    }

    const handleCreate = () => {
        if(props.onCreate) {
            props.onCreate();
        }
    }

    const usersWithFullName = props.userData.map(user => {
        return {...user, fullName: user.firstName + " " + user.lastName};
    });
    
    return (
        <div className={props.className}>
            <MaterialTable
                data={usersWithFullName}
                options={{
                    search: false,
                    filtering: true
                }}
                icons={materialTableIcons}
                title = 'Users'
                columns={[
                    { 
                        title: "User", 
                        field: "fullName", 
                        headerStyle: {width: '150px'} 
                    },
                    { 
                        title: "Login",
                        field: "login",
                        headerStyle: {width: '120px'}
                    },
                    { 
                        title: "Type", 
                        field: "type",
                        headerStyle: {width: '120px'}
                    },
                    {
                        title: 'Actions',
                        field: 'actions',
                        headerStyle: {width: '200px', textAlign: 'center'},
                        sorting: false,
                        filtering: false,
                        searchable: false,
                        render: (rowData) => 
                        <div className="actions-wrapper">
                            {
                                props.canModifyOthersTrips && 
                                <Button variant="contained" onClick={handleTrips(rowData.id)}>Trips</Button>
                            }
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
                    }
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

export const UserGrid = styled(_UserGrid)`
    max-width: 1000px;
    width: 100vw;
    margin: 0px auto;

    .actions-wrapper {
        display: flex;
        justify-content: center;
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