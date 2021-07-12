const NFT_TYPES = Object.freeze({
  price: {
    label: 'Price',
    value: 'price'
  },
  quantity: {
    label: 'Quantity',
    value: 'quantity'
  },
})

const NFT_TYPES_ARRAY = [
  NFT_TYPES.price,
  NFT_TYPES.quantity
]

export {
  NFT_TYPES,
  NFT_TYPES_ARRAY
};