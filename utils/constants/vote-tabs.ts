const VOTE_TABS = Object.freeze({
  active: {
    LABEL: 'Active',
    VALUE: 'active'
  },
  all: {
    LABEL: 'All',
    VALUE: 'all'
  },
  newProposal: {
    LABEL: 'New Proposal',
    VALUE: 'newProposal'
  }
})

const VOTE_TABS_ARRAY = [
  VOTE_TABS.active,
  VOTE_TABS.all,
  VOTE_TABS.newProposal
]

export {
  VOTE_TABS,
  VOTE_TABS_ARRAY
};