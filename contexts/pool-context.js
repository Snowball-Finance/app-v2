import { createContext, useContext } from 'react'
import { useQuery } from '@apollo/client'

import { LAST_SNOWBALL_INFO } from 'api/init/queries'

const ContractContext = createContext(null)

export function PoolContractProvider({ children }) {
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = useQuery(LAST_SNOWBALL_INFO);

  const getGaugeInfo = (address) => {
    const gauge = pools.find((pool) => pool.address.toLowerCase() === address.toLowerCase());
    return gauge;
  }

  return (
    <ContractContext.Provider
      value={{
        pools,
        getGaugeInfo
      }}
    >
      {children}
    </ContractContext.Provider>
  )
}

export function usePoolContract() {
  const context = useContext(ContractContext)
  if (!context) {
    throw new Error('Missing stats context')
  }

  const {
    pools,
    getGaugeInfo
  } = context

  return {
    pools,
    getGaugeInfo
  }
}