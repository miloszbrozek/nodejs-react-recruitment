import * as React from 'react';
import classnames from 'classnames';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { UserType, GetUserData } from '~/common/models/user.models';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

export type UserFormProps = {
    allowToChangeType: boolean;
    className?: string;
    currentValues?: GetUserData;
    onSubmit?: (values: UserFormValues) => void;
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
    const [values, setValues] = React.useState({
        login: getCurrentValue(props, 'login', ''),
        firstName: getCurrentValue(props, 'firstName', ''),
        lastName: getCurrentValue(props, 'lastName', ''),
        type: getCurrentValue(props, 'type', UserType.Regular),
        password: ''
    });

    
    const handleChange = fieldName => event => {
        setValues({...values, [fieldName]: event.target.value});
    }
    const handleSubmit = () => {
        const result = {
            firstName: values.firstName,
            lastName: values.lastName,
            login: values.login,
            password: values.password,
            type: props.allowToChangeType ? values.type : UserType.Regular
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
            <TextField
                id="login"
                label="Login"
                value={values.login}
                onChange={handleChange('login')}
                margin="normal"
            />
            <TextField
                id="firstName"
                label="First name"
                value={values.firstName}
                onChange={handleChange('firstName')}
                margin="normal"
            />
            <TextField
                id="lastName"
                label="Last name"
                value={values.lastName}
                onChange={handleChange('lastName')}
                margin="normal"
            />
            {props.allowToChangeType && 
                <FormControl margin="normal">
                    <InputLabel htmlFor="type-input">Type</InputLabel>
                    <Select
                        value={values.type}
                        onChange={handleChange('type')}
                        inputProps={{
                            name: 'type-input',
                            id: 'type-input',
                        }}
                    >
                    <MenuItem value={UserType.Regular}>Regular</MenuItem>
                    <MenuItem value={UserType.Manager}>Manager</MenuItem>
                    <MenuItem value={UserType.Admin}>Admin</MenuItem>
                    </Select>
                </FormControl>
            }
            <TextField
                id="password"
                label="Password"
                value={values.password}
                onChange={handleChange('password')}
                margin="normal"
                type="password"
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