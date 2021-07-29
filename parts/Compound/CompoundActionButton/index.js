import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import LaunchIcon from '@material-ui/icons/Launch';
import SystemUpdateAltRoundedIcon from '@material-ui/icons/SystemUpdateAltRounded';
import clsx from 'clsx';
import ContainedButton from 'components/UI/Buttons/ContainedButton';
import { useRouter } from 'next/router';
import { memo } from 'react';

const useStyles = makeStyles((theme) => ({
	button: { 
		textTransform: 'none'
	},
	Details: {
		backgroundColor: theme.palette.primary
	},
	Deposit: {
		backgroundColor: theme.custom.palette.green
	},
	Get_PGL: {
		backgroundColor: theme.custom.palette.png_orange
	},
	Get_JLP: {
		backgroundColor: theme.custom.palette.joe_red
	},
	Get_s3D: {
		backgroundColor: theme.custom.palette.s3d_blue
	},
	Get_s3F: {
		backgroundColor: theme.custom.palette.s3f_green
	}
}));
const getIcon = (type) => {
	if (type == "Details") {
		return (<ArrowDropDownCircleIcon />);
	}
	if (type == "Get_PGL" || type == "Get_JLP" || type == "Get_s3D" || type == "Get_s3F") {
		return (<LaunchIcon />);
	}
	if (type == "Deposit") {
		return (<SystemUpdateAltRoundedIcon />);
	}
}

const CompoundActionButton = ({
	type, 
	action,
	endIcon = true
}) => {
	const classes = useStyles();
	const router = useRouter();

	return (
		<ContainedButton
		className={clsx({[classes.button]: endIcon}, classes[type])}
		size={endIcon ? 'small' : ''}
		disableElevation = {endIcon ? true : false}
		endIcon={endIcon ? getIcon(type) : null}
		onClick={() => {action(router)}}
		>
		{type.replace("_", " ")}
		</ContainedButton>
	);
};

export default memo(CompoundActionButton);
