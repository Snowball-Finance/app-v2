
const getStatusColor = (value) => {
  switch (value) {
    case 'Active':
      return {
        color: '#28C76F',
        backgroundColor: 'rgba(40, 199, 111, 0.12)'
      }
    case 'Executed':
      return {
        color: '#28A2FF',
        backgroundColor: 'rgba(40, 162, 255, 0.12)'
      }
    case 'Failed':
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