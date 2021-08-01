
import { VAULT_S3D_IMAGE_PATH, VAULT_S3F_IMAGE_PATH } from 'utils/constants/image-paths'

const getVaultInfo = (value) => {
  switch (value) {
    case 's3D':
      return {
        icon: VAULT_S3D_IMAGE_PATH,
        color: 'primary'
      }
    case 's3F':
      return {
        icon: VAULT_S3F_IMAGE_PATH,
        color: 'secondary'
      }
    case 's4D':
      return {
        icon: '',
        color: 'grey'
      }
    default:
      return {
        icon: '',
        color: 'grey'
      }
  }
}

export default getVaultInfo