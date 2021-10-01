const NFT_TABS = Object.freeze({
  shop: {
    LABEL: 'Shop',
    VALUE: 'shop'
  },
  claim: {
    LABEL: 'Claim',
    VALUE: 'claim'
  },
  collection: {
    LABEL: 'Your collection',
    VALUE: 'collection'
  }
})

const NFT_TABS_ARRAY = [
  NFT_TABS.shop,
  NFT_TABS.claim,
  NFT_TABS.collection
]

export {
  NFT_TABS,
  NFT_TABS_ARRAY
};