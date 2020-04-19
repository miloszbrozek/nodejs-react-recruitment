import * as React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';


export const FormikSelectField = (props) => {
    const {
        field,
        form,
        inputProps,
        label,
        ...otherProps
    } = props;

    const coalescedInputProps = inputProps || { name: field.name}

    return (
        <>
            <InputLabel htmlFor={field.name}>{props.label}</InputLabel>
            <Select
                inputProps={coalescedInputProps}
                {...field} 
                {...otherProps}
            >
                {props.children}
            </Select>
        </>
    );
}