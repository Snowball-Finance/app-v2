import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid } from '@material-ui/core'
import { Controller } from 'react-hook-form'

import SnowTextField from 'components/UI/TextFields/SnowTextField'
import ContainedButton from 'components/UI/Buttons/ContainedButton'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2.5),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    textTransform: 'unset',
    backgroundColor: theme.palette.text.secondary
  }
}))

const ProposalMainForm = ({
  control,
  errors
}) => {
  const classes = useStyles()

  return (
    <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='title'
            label='Title of new proposal'
            placeholder='Title of new proposal'
            error={errors.title?.message}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            rows={15}
            multiline={true}
            name='data'
            label='Description of new proposal'
            placeholder='Description of new proposal'
            error={errors.data?.message}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <ContainedButton
            type='submit'
            color='primary'
            className={classes.button}
          >
            Submit
          </ContainedButton>
        </Grid>
      </Grid>
    </Card>
  )
}

export default memo(ProposalMainForm)
