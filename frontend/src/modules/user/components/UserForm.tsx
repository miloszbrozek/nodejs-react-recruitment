import * as React from 'react';
import classnames from 'classnames';
import Button from '@material-ui/core/Button';
import { UserType, GetUserData } from '~/common/models/user.models';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import { object, string } from 'yup';
import { FormikActions, Formik, Form, Field } from 'formik';
import { ErrorOutlet } from '~/common/components/ErrorOutlet';
import { FormikTextField } from '~/common/components/FormikTextField';
import { FormikSelectField } from '~/common/components/FormikSelectField';

export type UserFormProps = {
    allowToChangeType: boolean;
    className?: string;
    currentValues?: GetUserData;
    onSubmit?: (values: UserFormValues) => Promise<any>;
    onCancel?: () => void;
}

export type UserFormValues = {
    login: string;
    firstName: string;
    lastName: string;
    type: UserType,
    password: string
}

const getCurrentValue = (props: UserFormProps, fieldName: string, defaultValue: any) => {
    return (props.currentValues ? props.currentValues[fieldName] : null) || defaultValue;
}
const _UserForm = (props: UserFormProps) => {
    const [error, setError] = React.useState(null);
    
    const handleSubmit = (values: UserFormValues, actions: FormikActions<UserFormValues>) => {
        const result = {
            firstName: values.firstName,
            lastName: values.lastName,
            login: values.login,
            password: values.password,
            type: props.allowToChangeType ? values.type : UserType.Regular
        };
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
        <Formik<UserFormValues>
            initialValues={{ 
                login: getCurrentValue(props, 'login', ''),
                firstName: getCurrentValue(props, 'firstName', ''),
                lastName: getCurrentValue(props, 'lastName', ''),
                type: getCurrentValue(props, 'type', UserType.Regular),
                password: ''
            }}
            onSubmit={handleSubmit}
            validationSchema={object().shape({
                login: string().required('Login is a required field'),
                firstName: string().required('First name is a required field'),
                lastName: string().required('Last name is a required field'),
                password: string().required('Password is a required field')
            })}
            render={(formProps) => (
                <Form className={classnames('p-4 new-user-form', props.className)}>
                    <Field
                        name="login"
                        label="Login"
                        margin="normal"
                        component={FormikTextField}
                    />
                    <Field
                        name="firstName"
                        label="First name"
                        margin="normal"
                        component={FormikTextField}
                    />
                    <Field
                        name="lastName"
                        label="Last name"
                        margin="normal"
                        component={FormikTextField}
                    />
                    {props.allowToChangeType && 
                        <FormControl margin="normal">
                            <Field 
                                label="Type"
                                name="type"
                                component={FormikSelectField}
                            >
                                <MenuItem value={UserType.Regular}>Regular</MenuItem>
                                <MenuItem value={UserType.Manager}>Manager</MenuItem>
                                <MenuItem value={UserType.Admin}>Admin</MenuItem>
                            </Field>
                        </FormControl>
                    }
                    <Field
                        name="password"
                        label="Password"
                        margin="normal"
                        type="password"
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
                        
                </Form>)}
        />
    );
}

export const UserForm = styled(_UserForm)`
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