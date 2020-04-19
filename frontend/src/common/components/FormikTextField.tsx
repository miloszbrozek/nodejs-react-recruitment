import * as React from 'react';
import TextField from '@material-ui/core/TextField';


export const FormikTextField = (props) => {
    const {
        field,
        form,
        ...otherProps
    } = props;

    const error = Boolean((form.touched[field.name] || form.dirty[field.name]) && form.errors[field.name]);
    const errorText = error ? form.errors[field.name] : null;
    return (
        <TextField error={error} helperText={errorText} {...field} {...otherProps}/>
    );
}