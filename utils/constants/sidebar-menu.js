import LINKS from 'utils/constants/links'

import { Home, BookOpen, GitHub, Send, Link, Download, Archive } from 'react-feather';
import StableVaultIcon from 'components/Icons/StableVaultIcon'
import CompoundAndEarnIcon from 'components/Icons/CompoundAndEarnIcon'
import NftMarketplaceIcon from 'components/Icons/NftMarketplaceIcon'

const SIDEBAR_MENU = [
  {
    ICON: Home,
    ...LINKS.HOME
  },
  {
    ICON: StableVaultIcon,
    TITLE: 'StableVault',
    CHILDREN: [
      LINKS.S3D_VAULT,
      LINKS.S3F_VAULT,
      LINKS.S4D_VAULT,
    ]
  },
  {
    ICON: CompoundAndEarnIcon,
    ...LINKS.COMPOUND_AND_EARN
  },
  {
    ICON: Download,
    ...LINKS.STAKING
  },
  //{
  //  ICON: VoteIcon,
  //  ...LINKS.VOTE
  //},
  {
    ICON: NftMarketplaceIcon,
    ...LINKS.NFT_MARKETPLACE
  },
  {
    ICON: BookOpen,
    ...LINKS.DOCS
  },
  {
    ICON: GitHub,
    ...LINKS.GITHUB
  },
  {
    ICON: Send,
    ...LINKS.TELEGRAM
  },
  {
    ICON: Link,
    ...LINKS.DISCORD
  },
  {
    ICON: Archive,
    ...LINKS.REGRESS
  }
]

export default SIDEBAR_MENU