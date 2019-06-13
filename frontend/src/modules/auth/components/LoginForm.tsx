import * as React from 'react';
import TextField from '@material-ui/core/TextField';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import classnames from 'classnames';
import { AuthServiceCtx } from '~/common/services/AuthService';
import { Link } from 'react-router-dom';

export type LoginFormProps = {
    className?: string;
    onLoggedIn?: () => void;
}

export const LoginForm = styled((props: LoginFormProps) => {
    const authService = React.useContext(AuthServiceCtx);
    const [values, setValues] = React.useState({
        login: '',
        password: '',
      });
    const handleChange = fieldName => event => {
        setValues({...values, [fieldName]: event.target.value});
    }
    const handleSubmit = () => {
        authService.login(values.login, values.password)
            .then(() => {
                if(props.onLoggedIn) {
                    props.onLoggedIn();
                }
            })
    }
    
    return (
        <form className={classnames('p-4 login-form', props.className)} noValidate autoComplete="off">
            <TextField
                id="login"
                label="Login"
                value={values.login}
                onChange={handleChange('login')}
                margin="normal"
            />
            <TextField
                id="password"
                label="Password"
                value={values.password}
                onChange={handleChange('password')}
                margin="normal"
                type="password"
            />
            <span className='mt-4' >
                Don't have an account? Click <Link to='/register'>here</Link> to register.
            </span>
            
            <Button variant="contained" className="mt-4" onClick={handleSubmit}>
                Submit
            </Button>
        </form>
    );
})`
    &.login-form {
        display: flex;
        flex-direction: column;
        max-width: 300px;
        width: 100vw;
    }    
`