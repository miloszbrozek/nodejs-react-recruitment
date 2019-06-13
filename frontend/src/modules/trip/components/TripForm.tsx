import * as React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { TripData } from '../models/trip.models';
import { consts } from '~/common/consts';
import { object, string } from 'yup';
import { FormikActions, Formik, Form, Field } from 'formik';
import { FormikDatePicker } from '~/common/components/FormikDatePicker';
import { ErrorOutlet } from '~/common/components/ErrorOutlet';
import { FormikTextField } from '~/common/components/FormikTextField';
import moment from 'moment';

export type TripFormProps = {
    className?: string;
    currentValues?: TripData;
    onSubmit?: (values: TripFormValues) => Promise<any>;
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
    const [error, setError] = React.useState(null);

    const validateStartEndDates = (startDate: Date, endDate: Date) => {
        if(!moment(startDate).isBefore(moment(endDate))) {
            setError({
                message: 'Start date should be before end date'
            });
            return false;
        }
        return true;
    }

    const handleSubmit = (values: TripFormValues, actions: FormikActions<TripFormValues>) => {
        const result = {
            startDate: values.startDate,
            endDate: values.endDate,
            destination: values.destination,
            comment: values.comment
        };
        if(!validateStartEndDates(values.startDate, values.endDate)){
            return;
        }
        if(props.onSubmit) {
            props.onSubmit(result)
                .then(() => actions.setSubmitting(false))
                .catch(err => {
                    actions.setSubmitting(false);
                    setError(err);
                })
        } else {
            actions.setSubmitting(false);
        }
    }
    const handleCancel = () => {
        if(props.onCancel) {
            props.onCancel();
        }
    }

    return (
        <>
            <Formik<TripFormValues>
                initialValues={{ 
                    startDate: getCurrentValue(props, 'startDate', null),
                    endDate: getCurrentValue(props, 'endDate', null),
                    destination: getCurrentValue(props, 'destination', ''),
                    comment: getCurrentValue(props, 'comment','')
                }}
                onSubmit={handleSubmit}
                validationSchema={object().shape({
                    startDate: string().required('Start date is a required field'),
                    endDate: string().required('End date is a required field'),
                    destination: string().required('Destination is a required field'),
                    comment: string().required('Comment is a required field')
                })}
                render={(formProps) => (
                    <Form className={classnames('p-4 new-user-form', props.className)}>
                        <Field
                            disablePast
                            name="startDate"
                            label="Start date"
                            format={consts.dateFormat}
                            margin="normal"
                            component={FormikDatePicker}
                        />
                        <Field
                            disablePast
                            name="endDate"
                            label="End date"
                            format={consts.dateFormat}
                            margin="normal"
                            component={FormikDatePicker}
                        />
                        <Field
                            name="destination"
                            label="Destination"
                            margin="normal"
                            component={FormikTextField}
                        />
                        <Field
                            name="comment"
                            label="Comment"
                            margin="normal"
                            component={FormikTextField}
                        />

                        <ErrorOutlet error={error} className="mt-1"/>

                        <div className="two-buttons">
                            <Button variant="contained" className="mt-4" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button disabled={formProps.isSubmitting} type="submit" variant="contained" className="mt-4">
                                Submit
                            </Button>
                        </div>
                    </Form>
                )}
            />
            
        </>
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