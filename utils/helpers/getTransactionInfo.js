
import TokenSwapIcon from 'components/Icons/TokenSwapIcon'
import TokenRemoveIcon from 'components/Icons/TokenRemoveIcon'
import TokenAddIcon from 'components/Icons/TokenAddIcon'

const getTransactionInfo = (value) => {
  switch (value) {
    case 'swap':
      return {
        icon: TokenSwapIcon,
        color: '#28A2FF'
      }
    case 'remove':
      return {
        icon: TokenRemoveIcon,
        color: '#EA5455'
      }
    case 'add':
      return {
        icon: TokenAddIcon,
        color: '#28C76F'
      }
    default:
      return {
        icon: TokenSwapIcon,
        color: '#28A2FF'
      }
  }
}

export default getTransactionInfo