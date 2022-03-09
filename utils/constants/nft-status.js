
const NFT_STATUS = Object.freeze({
  NOT_CLAIMMABLE: {
    LABEL: 'Not Claimmable',
    VALUE: 'NOT_CLAIMMABLE',
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
