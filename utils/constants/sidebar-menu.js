
import LINKS from 'utils/constants/links'

import HomeIcon from 'components/Icons/HomeIcon'
import MessageIcon from 'components/Icons/MessageIcon'
// ? hide vote page by great.dolphin.ls for first release
// import VoteIcon from 'components/Icons/VoteIcon'
import CartIcon from 'components/Icons/CartIcon'
import BubbleIcon from 'components/Icons/BubbleIcon'
import FeatherIcon from 'components/Icons/FeatherIcon'
import ChatIcon from 'components/Icons/ChatIcon'

const SIDEBAR_MENU = [
  {
    ICON: HomeIcon,
    ...LINKS.HOME
  },
  {
    ICON: HomeIcon,
    TITLE: 'StableVault',
    CHILDREN: [
      LINKS.S3D_VAULT,
      LINKS.S3F_VAULT
    ]
  },
  {
    ICON: MessageIcon,
    ...LINKS.COMPOUND_AND_EARN
  },
  {
    ICON: MessageIcon,
    ...LINKS.STAKING
  },
  // ? hide vote page by great.dolphin.ls for first release
  // {
  //   ICON: VoteIcon,
  //   ...LINKS.VOTE
  // },
  {
    ICON: CartIcon,
    ...LINKS.NFT_MARKETPLACE
  },
  {
    ICON: BubbleIcon,
    ...LINKS.DOCS
  },
  {
    ICON: FeatherIcon,
    ...LINKS.GITHUB
  },
  {
    ICON: ChatIcon,
    ...LINKS.TELEGRAM
  },
  {
    ICON: ChatIcon,
    ...LINKS.DISCORD
  },
]

export default SIDEBAR_MENU