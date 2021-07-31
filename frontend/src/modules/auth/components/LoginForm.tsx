import * as React from 'react';
import { FormikActions, Formik, Form, Field } from 'formik';
import { object, string } from 'yup';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { Link } from 'react-router-dom';
import { ErrorOutlet } from '~/common/components/ErrorOutlet';
import { FormikTextField } from '~/common/components/FormikTextField';
import { consts } from '~/common/consts';

export type LoginFormProps = {
    className?: string;
    onLoggedIn?: () => void;
}

type LoginValues = {
    login: string;
    password: string;
}



export const LoginForm = styled((props: LoginFormProps) => {
    const authService = React.useContext(AuthServiceCtx);
    const [error, setError] = React.useState(null);
    const handleSubmit = (values: LoginValues, actions: FormikActions<LoginValues>) => {
        authService.login(values.login, values.password)
            .then(() => {
                actions.setSubmitting(false);
                if(props.onLoggedIn) {
                    props.onLoggedIn();
                }
            }).catch(err => {
                actions.setSubmitting(false);
                setError(err);
            });
    }
    
    return (
        <Formik<LoginValues> 
            initialValues={{ login: "", password: "" }}
            onSubmit={handleSubmit}
            validationSchema={object().shape({
                login: string().required('Login is a required field'),
                password: string().required('Password is a required field')
            })}
            render={(formProps) => (
                <Form className={classnames('p-4 login-form', props.className)}>
                    <Field
                        name="login"
                        label="Login"
                        margin="normal"
                        component={FormikTextField}
                    />
                    <Field
                        name="password"
                        label="Password"
                        margin="normal"
                        type="password"
                        component={FormikTextField}
                    />
                    <span className='mt-4' >
                        Don't have an account? Click <Link to={consts.navigation.Register}>here</Link> to register.
                    </span>

                    <ErrorOutlet error={error} className="mt-1"/>
                    
                    <Button disabled={formProps.isSubmitting} type="submit" variant="contained" className="mt-4">
                        Submit
                    </Button>
                </Form>
            )}
        />
    );
})`
    &.login-form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        width: 100vw;
    }    
`