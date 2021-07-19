
const getStatusColor = (value) => {
  switch (value) {
    case 'active':
      return {
        color: '#28C76F',
        backgroundColor: 'rgba(40, 199, 111, 0.12)'
      }
    case 'executed':
      return {
        color: '#28A2FF',
        backgroundColor: 'rgba(40, 162, 255, 0.12)'
      }
    case 'failed':
      return {
        color: '#DF5F67',
        backgroundColor: 'rgba(223, 95, 103, 0.12)'
      }
    default:
      return {
        color: '#28C76F',
        backgroundColor: 'rgba(40, 199, 111, 0.12)'
      }
  }
}

export default getStatusColor