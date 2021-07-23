
import { memo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useVoteContract } from 'contexts/vote-context'
import ProposalMainForm from './ProposalMainForm'
import ProposalSubForm from './ProposalSubForm'
import { STRING_VALID, VOTE_PERIOD_VALID } from 'utils/constants/validations'

const schema = yup.object().shape({
  title: STRING_VALID,
  data: STRING_VALID,
  votingPeriod: VOTE_PERIOD_VALID
});

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    maxWidth: theme.custom.layout.maxDesktopWidth,
  }
}));

const NewProposal = () => {
  const classes = useStyles();
  const { createProposal } = useVoteContract();

  const { control, handleSubmit, errors } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    createProposal(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={classes.container}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='body1'>
            New Proposal
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <ProposalMainForm
            control={control}
            errors={errors}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ProposalSubForm
            control={control}
            errors={errors}
          />
        </Grid>
      </Grid>
    </form>
  )
}

export default memo(NewProposal)