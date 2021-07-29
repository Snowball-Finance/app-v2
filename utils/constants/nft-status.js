
const NFT_STATUS = Object.freeze({
  NOT_DONATE: {
    LABEL: 'Did not donate',
    VALUE: 'NOT_DONATE',
    BUTTON: 'UNCLAIMABLE'
  },
  CLAIMED: {
    LABEL: 'Claimed',
    VALUE: 'CLAIMED',
    BUTTON: 'SEE IN YOUR COLLECTION'
  },
  ELIGIBLE: {
    LABEL: 'Eligible',
    VALUE: 'ELIGIBLE',
    BUTTON: 'CLAIM'
  }
})

export default NFT_STATUS;
