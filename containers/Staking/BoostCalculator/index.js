import { memo, useState } from 'react'
import { Grid } from '@material-ui/core'

import CardWrapper from '../CardWrapper'
import CalculatorForm from './CalculatorForm'
import CalculatorPreview from './CalculatorPreview'

const BoostCalculator = () => {
  const [selectedGauge, setSelectedGauge] = useState({})
  const [boostFactor, setBoostFactor] = useState(0)
  const [xSnobRequired, setXSnobRequired] = useState(0)

  return (
    <CardWrapper title='Snowball Boost Calculator'>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <CalculatorForm
            setSelectedGauge={setSelectedGauge}
            setBoostFactor={setBoostFactor}
            setXSnobRequired={setXSnobRequired}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CalculatorPreview
            selectedGauge={selectedGauge}
            boostFactor={boostFactor}
            xSnobRequired={xSnobRequired}
          />
        </Grid>
      </Grid>
    </CardWrapper>
  )
}

export default memo(BoostCalculator)
