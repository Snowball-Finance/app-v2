const VAULT_TABS = Object.freeze({
  swap: {
    LABEL: 'Swap',
    VALUE: 'swap'
  },
  liquidity: {
    LABEL: 'Liquidity',
    VALUE: 'liquidity'
  },
  transactions: {
    LABEL: 'Transactions',
    VALUE: 'transactions'
  },
  share: {
    LABEL: 'My share',
    VALUE: 'share'
  },
})

const VAULT_TABS_ARRAY = [
  VAULT_TABS.swap,
  VAULT_TABS.liquidity,
  VAULT_TABS.transactions,
  VAULT_TABS.share,
]

export {
  VAULT_TABS,
  VAULT_TABS_ARRAY
};