import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Card, Grid, Typography } from '@material-ui/core'
import { Controller } from 'react-hook-form'

import SnowTextField from 'components/UI/TextFields/SnowTextField'
import ContainedButton from 'components/UI/Buttons/ContainedButton'
import { useContracts } from 'contexts/contract-context'
import { minimumForProposal } from 'utils/constants/voting-limits'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(1.5, 2.5),
    backgroundColor: theme.palette.background.primary
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    textTransform: 'unset',
    backgroundColor: theme.palette.text.secondary
  },
  required: {
    color: 'red',
    marginRight: theme.spacing(1)
  }
}))

const ProposalMainForm = ({
  control,
  errors,
  loading
}) => {
  const classes = useStyles()
  const { snowconeBalance } = useContracts()

  return (
    <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            as={<SnowTextField />}
            name='title'
            label={
              <>
              Title of new proposal<Typography variant='subtitle' className={classes.required}> * </Typography>
              </>
            }
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
            name='description'
            label={
              <>
              Description of new proposal<Typography variant='subtitle' className={classes.required}> * </Typography>
              </>
            }
            placeholder='Description of new proposal'
            error={errors.data?.message}
            control={control}
            defaultValue={''}
          />
        </Grid>
        <Typography className={classes.required}> * </Typography>
        <Typography variant='caption'>Required fields</Typography> 

        <Grid item xs={12} className={classes.buttonContainer}>
          {snowconeBalance < minimumForProposal && 
            <Typography variant="body1" className={classes.required}>{`You must have ${minimumForProposal.toLocaleString()}+ xSNOB to submit`}</Typography>
          }
          <ContainedButton
            type='submit'
            color='primary'
            disabled={snowconeBalance < minimumForProposal}
            loading={loading}
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
