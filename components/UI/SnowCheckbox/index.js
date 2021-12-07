import { Checkbox, FormControlLabel, withStyles } from '@material-ui/core';

import { useState } from "react";

const checkBoxStyles = (theme) => ({
    root: {
        color: theme.palette.secondary.main,
        '&$checked': {
            color: theme.palette.primary.main,
        },
    },
    checked: {},

});

const CustomCheckbox = withStyles(checkBoxStyles)(Checkbox);


export const SnowCheckbox = ({ onChange, isChecked, label, size = "small", ...rest }) => {
    const [checked, setChecked] = useState(isChecked)
    const handleCheckClick = (v) => {
        setChecked(v)
        onChange && onChange(v)
    }
    return <FormControlLabel
        label={label}
        control={<CustomCheckbox
            onChange={(e, checked) => { handleCheckClick(checked) }}
            {...{ size, checked }} />}
        {...rest}
    />

}