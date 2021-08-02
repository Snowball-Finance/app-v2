import LINKS from 'utils/constants/links'

import {
  Home,
  Layers,
  Anchor,
  ShoppingCart,
  BookOpen,
  GitHub,
  Send,
  Link,
  Download,
} from 'react-feather'
import StableVaultIcon from 'components/Icons/StableVaultIcon'
import CompoundAndEarn from 'components/Icons/CompoundAndEarn'
import NftMarketplace from 'components/Icons/NftMarketplace'

const SIDEBAR_MENU = [
  {
    ICON: Home,
    ...LINKS.HOME,
  },
  {
    ICON: StableVaultIcon,
    TITLE: 'StableVault',
    CHILDREN: [LINKS.S3D_VAULT, LINKS.S3F_VAULT, LINKS.S4D_VAULT],
  },
  {
    ICON: CompoundAndEarn,
    ...LINKS.COMPOUND_AND_EARN,
  },
  {
    ICON: Download,
    ...LINKS.STAKING,
  },
  {
    ICON: NftMarketplace,
    ...LINKS.NFT_MARKETPLACE,
  },
  {
    ICON: BookOpen,
    ...LINKS.DOCS,
  },
  {
    ICON: GitHub,
    ...LINKS.GITHUB,
  },
  {
    ICON: Send,
    ...LINKS.TELEGRAM,
  },
  {
    ICON: Link,
    ...LINKS.DISCORD,
  },
]

export default SIDEBAR_MENU
