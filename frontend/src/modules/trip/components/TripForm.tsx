import * as React from 'react';
import classnames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { TripData } from '../models/trip.models';
import { DatePicker } from "@material-ui/pickers";
import { consts } from '~/common/consts';

export type TripFormProps = {
    className?: string;
    currentValues?: TripData;
    onSubmit?: (values: TripFormValues) => void;
    onCancel?: () => void;
}

export type TripFormValues = {
    startDate: Date;
    endDate: Date;
    destination: string;
    comment: string;
}

const getCurrentValue = (props: TripFormProps, fieldName: string, defaultValue: any) => {
    return (props.currentValues ? props.currentValues[fieldName] : null) || defaultValue;
}
const _TripForm = (props: TripFormProps) => {
    const [values, setValues] = React.useState({
        startDate: getCurrentValue(props, 'startDate', null),
        endDate: getCurrentValue(props, 'endDate', null),
        destination: getCurrentValue(props, 'destination', ''),
        comment: getCurrentValue(props, 'comment','')
    });

    
    const handleChange = fieldName => event => {
        setValues({...values, [fieldName]: event.target.value});
    }
    const handleDateChange = fieldName => date => {
        setValues({...values, [fieldName]: date});
    }
    const handleSubmit = () => {
        const result = {
            startDate: values.startDate,
            endDate: values.endDate,
            destination: values.destination,
            comment: values.comment
        };
        if(props.onSubmit) {
            props.onSubmit(result);
        }
    }
    const handleCancel = () => {
        if(props.onCancel) {
            props.onCancel();
        }
    }

    return (
        <form className={classnames('p-4 new-user-form', props.className)} noValidate autoComplete="off">
            <DatePicker
                id="startDate"
                label="Start date"
                value={values.startDate}
                onChange={handleDateChange('startDate')}
                format={consts.dateFormat}
                margin="normal"
            />
            <DatePicker
                id="endDate"
                label="End date"
                value={values.endDate}
                onChange={handleDateChange('endDate')}
                format={consts.dateFormat}
                margin="normal"
            />
            <TextField
                id="destination"
                label="Destination"
                value={values.destination}
                onChange={handleChange('destination')}
                margin="normal"
            />
            <TextField
                id="comment"
                label="Comment"
                value={values.comment}
                onChange={handleChange('comment')}
                margin="normal"
            />
            <div className="two-buttons">
                <Button variant="contained" className="mt-4" onClick={handleCancel}>
                    Cancel
                </Button>
                <Button variant="contained" className="mt-4" onClick={handleSubmit}>
                    Submit
                </Button>
            </div>
                
        </form>
    );
}

export const TripForm = styled(_TripForm)`
    &.new-user-form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        width: 100vw;

        .two-buttons {
            display: flex;
            justify-content: space-between;
        }
    }
`