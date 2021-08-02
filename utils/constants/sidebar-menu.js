import LINKS from 'utils/constants/links'

import { Home, Layers, Anchor, ShoppingCart, BookOpen, GitHub, Send, Link, Archive} from 'react-feather';
import StableVaultIcon from 'components/Icons/StableVaultIcon'

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
    ICON: Layers,
    ...LINKS.COMPOUND_AND_EARN
  },
  {
    ICON: Anchor,
    ...LINKS.STAKING
  },
  {
    ICON: ShoppingCart,
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