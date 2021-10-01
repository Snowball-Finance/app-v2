const STAKING_TABS = Object.freeze({
  info: {
    LABEL: 'Info',
    VALUE: 'info'
  },
  vote: {
    LABEL: 'Vote',
    VALUE: 'vote'
  },
  allocations: {
    LABEL: 'Allocations',
    VALUE: 'allocations'
  }
})

const STAKING_TABS_ARRAY = [
  STAKING_TABS.info,
  STAKING_TABS.vote,
  STAKING_TABS.allocations
]

export {
  STAKING_TABS,
  STAKING_TABS_ARRAY
};