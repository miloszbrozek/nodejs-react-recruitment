import * as React from 'react';
import { DatePicker } from '@material-ui/pickers';


export const FormikDatePicker = (props) => {
    const {
        field,
        form,
        ...otherProps
    } = props;

    const error = Boolean((form.touched[field.name] || form.dirty[field.name]) && form.errors[field.name]);
    const errorText = error ? form.errors[field.name] : null;
    return (
        <DatePicker 
            name={field.name}
            value={field.value}
            error={error} 
            helperText={errorText}
            onError={(_, error) => form.setFieldError(field.name, error)}
            onChange={date => form.setFieldValue(field.name, date, true)}
            {...otherProps} 
        />
    );
}