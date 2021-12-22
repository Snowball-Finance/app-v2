import { gql } from '@apollo/client';

const NFTS_LIST = gql`
  query {
    NFTsList{
      address
      name
      imgUrl
      title
      description
      artist
      category
      type
      max
      supply
      buyable
      baseCost
      bondCurve 
      isVideo
      saleDuration
      saleStartTime
      fullSize
    }
  }
`;

export { NFTS_LIST };
