import { createContext, useCallback, useContext } from 'react'

import { useAPIContext } from './api-context'

const ContractContext = createContext(null)

export function PoolContractProvider({ children }) {
  const { getLastSnowballInfo } = useAPIContext();
  const { data: { LastSnowballInfo: { poolsInfo: pools = [] } = {} } = {} } = getLastSnowballInfo();

  const getGaugeInfo = useCallback((address) => {
    const gauge = pools.find((pool) => pool.address.toLowerCase() === address.toLowerCase());
    return gauge;
  }, [pools])

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