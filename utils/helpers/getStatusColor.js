
const getStatusColor = (value) => {
  switch (value) {
    case 'Active':
      return {
        color: '#28C76F',
        backgroundColor: 'rgba(40, 199, 111, 0.12)'
      }
    case 'Defeated':
      return {
        color: '#DF5F67',
        backgroundColor: 'rgba(223, 95, 103, 0.12)'
      }
    case 'Pending Execution':
      return {
        color: '#C2A715',
        backgroundColor: 'rgba(255, 230, 0, 0.12)'
      }
    case 'Ready For Execution':
      return {
        color: '#28A2FF',
        backgroundColor: 'rgba(40, 162, 255, 0.12)'
      }
    case 'Executed':
      return {
        color: '#28C76F',
        backgroundColor: 'rgba(40, 199, 111, 0.12)'
      }
    case 'Vetoed':
      return {
        color: '#828282',
        backgroundColor: 'rgba(124, 124, 124, 0.12)'
      }
    default:
      return {
        color: '#DF5F67',
        backgroundColor: 'rgba(223, 95, 103, 0.12)'
      }
  }
}

export default getStatusColor