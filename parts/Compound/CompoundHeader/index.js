import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Typography } from '@material-ui/core'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import clsx from 'clsx'

import { COMPOUND_AND_EARN_BACKGROUND_IMAGE_PATH } from 'utils/constants/image-paths'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        height: 100,
        backgroundImage: `url(${COMPOUND_AND_EARN_BACKGROUND_IMAGE_PATH})`,
        backgroundSize: 'cover',
    },
    icon: {
        position: 'absolute',
        right: 40,
        bottom: 0,
        objectFit: 'contain',
        height: 100,
    },
    container: {
        marginLeft: theme.spacing(4),
    },
    header: {
        fontWeight: 'bold',
        color: theme.custom.palette.white,
        marginBottom: theme.spacing(1),
    },
    subHeaderButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        fontSize: 12,
        fontWeight: 600,
        color: theme.custom.palette.white,
        textTransform: 'none',
    },
    rightIcon: {
        backgroundColor: theme.custom.palette.blue,
        borderRadius: '50%',
    },
}))

const CompoundHeader = ({ title, subHeader, icon, className }) => {
    const classes = useStyles()

    return (
        <Card className={clsx(classes.root, className)}>
            <img alt="icon" src={icon} className={classes.icon} />
            <div className={classes.container}>
                <Typography variant="h5" className={classes.header}>
                    {title}
                </Typography>
                <ContainedButton
                    className={classes.subHeaderButton}
                    size="small"
                    disableElevation
                    endIcon={<ChevronRightIcon className={classes.rightIcon} />}
                >
                    {subHeader}
                </ContainedButton>
            </div>
        </Card>
    )
}

export default memo(CompoundHeader)
